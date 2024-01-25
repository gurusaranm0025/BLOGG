function Img({ src, caption }) {
  return (
    <div>
      <img className="rounded-md" src={src} alt="blog_image" />
      {caption.length ? (
        <p
          className="w-full font-noto text-center my-3 mb-1 md:mb-12 text-base text-dark-grey/60"
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
    <div className="bg-gunmetal-2/10 p-3 pl-5 border-l-4 border-gunmetal-2">
      <p
        className="text-xl leading-10 md:text-2xl font-noto tracking-wide italic"
        dangerouslySetInnerHTML={{ __html: quote }}
      ></p>
      {caption.length ? (
        <p
          className="w-full text-right text-purple/80 italic tracking-wider"
          dangerouslySetInnerHTML={{ __html: "-" + caption }}
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
            className="my-4 font-noto"
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
    return (
      <p
        dangerouslySetInnerHTML={{ __html: data.text }}
        className="font-noto text-black"
      ></p>
    );
  }

  if (type == "header") {
    if (data.level == 3) {
      return (
        <h3
          className="font-noto text-3xl font-semibold"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h3>
      );
    }

    return (
      <h2
        className="text-3xl font-noto font-bold"
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
