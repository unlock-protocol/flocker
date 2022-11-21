interface Props {
  description?: string;
  name: string;
  imageURL?: string;
}

export function Profile({ description, name, imageURL }: Props) {
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
        {name && <h1 className="text-lg font-bold sm:text-xl">@{name}</h1>}
      </div>
      {description && <p className="text-gray-600">{description}</p>}
    </header>
  );
}
