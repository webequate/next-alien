import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "@/components/ContactForm";

const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText("Name"), "Allen");
  await user.type(screen.getByLabelText("Email"), "allen@example.com");
  await user.type(screen.getByLabelText("Subject"), "Test subject");
  await user.type(screen.getByLabelText("Message"), "Test message");
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("ContactForm", () => {
  it("renders all visible form fields", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Subject")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
  });

  it("renders the honeypot field hidden from users", () => {
    render(<ContactForm />);
    const honeypot = document.querySelector('input[name="website"]');
    expect(honeypot).toBeInTheDocument();
    expect(honeypot).toHaveStyle({ display: "none" });
  });

  it("shows 'Send Message' on the submit button initially", () => {
    render(<ContactForm />);
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });

  it("shows 'Sending...' and disables the button while the request is in flight", async () => {
    let resolveRequest!: (r: Response) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise<Response>((res) => {
            resolveRequest = res;
          })
      )
    );

    const user = userEvent.setup();
    render(<ContactForm />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    // The button's aria-label is always "Send Message"; check disabled state
    // and inner text separately.
    const button = screen.getByRole("button", { name: /send message/i });
    expect(button).toBeDisabled();
    expect(button.textContent?.trim()).toBe("Sending...");

    // Settle the pending promise so React state is clean after the test
    resolveRequest(
      new Response(JSON.stringify({ message: "Done" }), { status: 200 })
    );
  });

  it("shows a success message and clears the form on a successful submission", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Email sent!" }), {
          status: 200,
        })
      )
    );

    const user = userEvent.setup();
    render(<ContactForm />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() =>
      expect(screen.getByText("Email sent!")).toBeInTheDocument()
    );

    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Subject")).toHaveValue("");
    expect(screen.getByLabelText("Message")).toHaveValue("");
  });

  it("falls back to a generic success message when the response has no message field", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({}), { status: 200 })
      )
    );

    const user = userEvent.setup();
    render(<ContactForm />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() =>
      expect(screen.getByText("Email sent successfully!")).toBeInTheDocument()
    );
  });

  it("shows an error message and preserves form data on a non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Server error" }), {
          status: 500,
        })
      )
    );

    const user = userEvent.setup();
    render(<ContactForm />);
    // All fields are required — must fill them all for the form to submit
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() =>
      expect(screen.getByText("Server error")).toBeInTheDocument()
    );

    // Form must not be cleared on error
    expect(screen.getByLabelText("Name")).toHaveValue("Allen");
  });

  it("falls back to a generic error message when a non-ok response has no message field", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({}), { status: 400 })
      )
    );

    const user = userEvent.setup();
    render(<ContactForm />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() =>
      expect(screen.getByText("Failed to send email.")).toBeInTheDocument()
    );
  });

  it("shows a network error message when fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network failure"))
    );

    const user = userEvent.setup();
    render(<ContactForm />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() =>
      expect(
        screen.getByText("An error occurred while sending the email.")
      ).toBeInTheDocument()
    );
  });

  it("POSTs the correct JSON payload to /api/send-email", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "Sent" }), { status: 200 })
    );
    vi.stubGlobal("fetch", mockFetch);

    const user = userEvent.setup();
    render(<ContactForm />);
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());

    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/send-email");
    expect(options.method).toBe("POST");
    const body = JSON.parse(options.body as string);
    expect(body.name).toBe("Allen");
    expect(body.email).toBe("allen@example.com");
    expect(body.subject).toBe("Test subject");
    expect(body.message).toBe("Test message");
  });
});
