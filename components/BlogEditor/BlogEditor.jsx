import Logo from "../Logo/Logo";
import AnimationWrapper from "../pageAnimation/AnimationWrapper";
import defBanner from "@/public/maria_back.jpg";

function BlogEditor() {
  function handleBannerUpload(e) {
    let img = e.target.files[0];
    console.log(img);
  }
  return (
    <>
      <nav className="navbar">
        <Logo />
        <p className="max-md:hidden text-back line-clamp-1 w-full">
          Blog Title
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2">Publish</button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video bg-white border-4 border-french-gray hover:opacity-80 duration-200">
              <label htmlFor="uploadBanner">
                <img src={defBanner} alt="blog banner image" className="z-20" />
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  id="uploadBanner"
                  onChange={handleBannerUpload}
                />
              </label>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
}

export default BlogEditor;
