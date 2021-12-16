import { WidePreview } from "../components/ArticlePreviews/WidePreview";
const articlePreviews = [
  {
    id: 1,
    title: "QR is here!",
    datePublished: new Date().toLocaleString(),
    paragraph:
      "quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima",
    photo: {
      url: "https://www.cloudsavvyit.com/p/uploads/2021/09/fa4a560f.jpg?width=1198&trim=1,1&bg-color=000&pad=1,1",
      text: "Qr Scanning",
    },
  },
  {
    id: 2,
    title: "Introducing our new App with great features",
    datePublished: new Date().toLocaleString(),
    paragraph:
      "Sed ut perspiciatis unde omnis iste natus error siue ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima",
    photo: {
      url: "https://www.protofuse.com/files/protofuse.com/images/blogs/cover-images/new-website-launch-release-announcement-tips.jpg",
      text: "Community App",
    },
  },
  {
    id: 3,
    title: "Track your bills",
    datePublished: new Date().toLocaleString(),

    paragraph:
      "Sed ut perspiciatis inventorsciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima",
    photo: {
      url: "https://xendoo.com/wp-content/uploads/2018/08/Accounting-11-reasons-online-billing-is-better.jpg",
      text: "Bill tracking",
    },
  },
];
function Bulletin() {
  return (
    <>
      <main>
        <div className="mx-auto w-3/4">
          {articlePreviews.map((item) => (
            <WidePreview article={item} key={item.id} />
          ))}{" "}
        </div>
      </main>
    </>
  );
}

export default Bulletin;
