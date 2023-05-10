// components/PostFooter.tsx

interface PostFooterProps {
  additional: string[];
}

const PostFooter: React.FC<PostFooterProps> = ({ additional }) => {
  return (
    <div className="text-center">
      {additional.map((line, index) => {
        return (
          <p key={index} className="text-xl mb-1">
            {line}
          </p>
        );
      })}
    </div>
  );
};

export default PostFooter;
