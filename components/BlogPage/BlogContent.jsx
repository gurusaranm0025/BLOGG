function Img({ src, caption }) {
  return (
    <div>
      <img src={src} alt="blog_image" />
      {caption.length ? (
        <p
          className="w-full text-center my-3 md:mb-12 text-base text-cadet-gray"
          dangerouslySetInnerHTML={{ __html: caption }}
        ></p>
      ) : (
        ""
      )}
    </div>
  );
}

function Quote({ quote, caption }) {
  return (
    <div className="bg-purple-500/10 p-3 pl-5 border-l-4 border-purple-400">
      <p
        className="text-xl leading-10 md:text-2xl"
        dangerouslySetInnerHTML={{ __html: quote }}
      ></p>
      {caption.length ? (
        <p
          className="w-full text-purple-600 "
          dangerouslySetInnerHTML={{ __html: caption }}
        ></p>
      ) : (
        ""
      )}
    </div>
  );
}

function List({ style, items }) {
  return (
    <ol className={`pl-5 ${style == "ordered" ? "list-decimal" : "list-disc"}`}>
      {items.map((item, i) => {
        return (
          <li
            key={i}
            className="my-4"
            dangerouslySetInnerHTML={{ __html: item }}
          ></li>
        );
      })}
    </ol>
  );
}

function BlogContent({ block }) {
  let { type, data } = block;

  if (type == "paragraph") {
    return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;
  }

  if (type == "header") {
    if (data.level == 3) {
      return (
        <h3
          className="text-3xl font-bold"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h3>
      );
    }

    return (
      <h2
        className="text-3xl font-bold"
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></h2>
    );
  }

  if (type == "image") {
    return <Img src={data.file.url} caption={data.caption} />;
  }

  if (type == "quote") {
    return <Quote quote={data.text} caption={data.caption} />;
  }

  if (type == "list") {
    return <List style={data.style} items={data.items} />;
  } else {
    return <p>this is a block</p>;
  }
}

export default BlogContent;
