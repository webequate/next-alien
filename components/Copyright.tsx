// components/Copyright.tsx
interface CopyrightProps {
  name: string;
}

const Copyright: React.FC<CopyrightProps> = ({ name }) => {
  return (
    <div className="font-general-regular flex justify-center items-center text-center">
      <div className="text-sm text-dark-2 dark:text-light-2 mt-4">
        &copy; {new Date().getFullYear()} {name}. All rights reserved.
      </div>
    </div>
  );
};

export default Copyright;
