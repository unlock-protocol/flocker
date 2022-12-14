import ReactMarkdown from "react-markdown";

interface Props {
  description?: string;
  name: string;
  imageURL?: string;
  externalURL?: string;
}

export function Profile({ description, name, imageURL, externalURL }: Props) {
  return (
    <header className="flex flex-col items-center gap-2 text-center">
      <div className="flex flex-col items-center gap-2">
        {imageURL && (
          <img
            src={imageURL}
            height={100}
            width={100}
            className="border border-gray-100 rounded-full"
            alt={name}
          />
        )}
        {name && (
          <h1 className="text-lg font-bold sm:text-xl whitespace-nowrap ">
            {name} {externalURL && <a href={externalURL}>🔗</a>}
          </h1>
        )}
      </div>
      {description && (
        <div className="text-gray-600">
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => {
                return <a className="underline" {...props} />;
              },
            }}
          >
            {description}
          </ReactMarkdown>
        </div>
      )}
    </header>
  );
}
