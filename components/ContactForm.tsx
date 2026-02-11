"use client";
// components/ContactForm.tsx
import Heading from "@/components/Heading";
import { useState } from "react";
import { ContactForm as ContactFormData } from "@/interfaces/ContactForm";
import FormInput from "@/components/FormInput";

type MessageType = "success" | "error" | null;

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<MessageType>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setStatusMessage("");
    setMessageType(null);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatusMessage(result.message || "Email sent successfully!");
        setMessageType("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          website: "",
        });
      } else {
        setStatusMessage(result.message || "Failed to send email.");
        setMessageType("error");
      }
    } catch (error) {
      setStatusMessage("An error occurred while sending the email.");
      setMessageType("error");
      console.error("Email send error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="leading-loose">
      <form
        onSubmit={handleSubmit}
        className="bg-light-1 dark:bg-dark-1 rounded-xl text-left p-6 sm:p-8"
      >
        <Heading text="Contact Form" />
        <FormInput
          inputLabel="Full Name"
          labelFor="name"
          inputType="text"
          inputId="name"
          inputName="name"
          placeholderText="Your Name"
          ariaLabelName="Name"
          onChange={handleChange}
          value={formData.name}
        />
        <FormInput
          inputLabel="Email"
          labelFor="email"
          inputType="email"
          inputId="email"
          inputName="email"
          placeholderText="Your Email"
          ariaLabelName="Email"
          onChange={handleChange}
          value={formData.email}
        />
        <FormInput
          inputLabel="Subject"
          labelFor="subject"
          inputType="text"
          inputId="subject"
          inputName="subject"
          placeholderText="Subject"
          ariaLabelName="Subject"
          onChange={handleChange}
          value={formData.subject}
        />

        <div className="mb-4">
          <label
            className="block text-lg text-dark-2 dark:text-light-2 mb-1"
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            className="w-full px-5 py-2 border text-dark-2 dark:text-light-2 bg-white dark:bg-black border-dark-2 dark:border-light-2 rounded-md shadow-sm text-md"
            id="message"
            name="message"
            cols={14}
            rows={6}
            aria-label="Message"
            onChange={handleChange}
            value={formData.message}
            required
          ></textarea>
        </div>

        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />

        <div>
          <button
            type="submit"
            disabled={isLoading}
            aria-label="Send Message"
            className="text-light-1 dark:text-light-1 bg-accent-dark dark:bg-accent-dark hover:bg-accent-light dark:hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed font-general-medium flex justify-center items-center w-40 sm:w-40 mb-6 sm:mb-0 text-lg py-2.5 sm:py-3 rounded-lg duration-300"
          >
            <span className="text-sm sm:text-lg">
              {isLoading ? "Sending..." : "Send Message"}
            </span>
          </button>
          {statusMessage && (
            <div
              className={`mt-4 text-lg font-medium ${
                messageType === "success"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {statusMessage}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
