import { useEffect } from "react";
import { CLIENT_NAME } from "../utils/appInfo";

function Home() {
  /*   useEffect(() => {
    axios.get("http://localhost:5000").then((res) => console.log(res));
  }, []); */
  useEffect(() => {
    document.title = CLIENT_NAME;
  }, []);
  return (
    <>
      <main>
        <section className="w-5/6 md:w-3/4 mx-auto text-gray-700 body-font">
          <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
            <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
              <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                We are online!
              </h1>
              <p className="mb-8 leading-relaxed">
                MMNP Systems manages the QR codes of residents of a subdivision.
                These QR codes serve as identification of residents and their
                visitors upon entering the subdivision.
              </p>
              <div className="flex justify-center">
                <button className="inline-flex text-white bg-slate-700 border-0 py-2 px-6 focus:outline-none hover:bg-teal-500 rounded text-lg">
                  Get started
                </button>
                <button className="ml-4 inline-flex text-gray-700 bg-gray-200 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 rounded text-lg">
                  Explore
                </button>
              </div>
            </div>
            <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
              <img
                className="object-cover object-center rounded"
                alt="qr"
                src="https://www.cloudsavvyit.com/p/uploads/2021/09/fa4a560f.jpg?width=1198&trim=1,1&bg-color=000&pad=1,1"
              />
            </div>
          </div>
        </section>
        <section className="text-gray-700 body-fontw-5/6 md:w-3/4 mx-auto">
          <div className="container px-5 py-24 mx-auto">
            <div className="text-center mb-20">
              <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900 mb-4">
                MMNP Systems now in Lessandra
              </h1>
              <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
                MMNP Systems manages the QR codes of residents of Lessandra.
                These QR codes serve as identification of residents and their
                visitors upon entering the subdivision.
              </p>
              <div className="flex mt-6 justify-center">
                <div className="w-16 h-1 rounded-full bg-slate-700 inline-flex"></div>
              </div>
            </div>
            <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4">
              <div className="p-4 md:w-1/3 md:mb-0 mb-6 flex flex-col text-center items-center">
                <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-slate-700 mb-5 flex-shrink-0"></div>
                <div className="flex-grow">
                  <h2 className="text-gray-900 text-lg title-font font-medium mb-3">
                    Create a User Account
                  </h2>
                  <p className="leading-relaxed text-base">
                    To start creating QR codes for your visitors, create an
                    account to register as a resident of Palmera Homes.
                  </p>
                  <a className="mt-3 text-teal-500 inline-flex items-center">
                    Learn More
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 ml-2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div className="p-4 md:w-1/3 md:mb-0 mb-6 flex flex-col text-center items-center">
                <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-slate-700 mb-5 flex-shrink-0"></div>
                <div className="flex-grow">
                  <h2 className="text-gray-900 text-lg title-font font-medium mb-3">
                    Create a Visitor QR code
                  </h2>
                  <p className="leading-relaxed text-base">
                    In your account panel, you can create QR codes for visitors
                    by typing in their information
                  </p>
                  <a className="mt-3 text-teal-500 inline-flex items-center">
                    Learn More
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 ml-2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div className="p-4 md:w-1/3 md:mb-0 mb-6 flex flex-col text-center items-center">
                <div className="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-slate-700 mb-5 flex-shrink-0"></div>
                <div className="flex-grow">
                  <h2 className="text-gray-900 text-lg title-font font-medium mb-3">
                    Scan QR Codes
                  </h2>
                  <p className="leading-relaxed text-base">
                    Log in as a HOA representative to scan QR codes to verify if
                    they are allowed to enter the subdivision
                  </p>
                  <a className="mt-3 text-teal-500 inline-flex items-center">
                    Learn More
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-4 h-4 ml-2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <button className="flex mx-auto mt-16 text-white bg-slate-700 border-0 py-2 px-6 focus:outline-none hover:bg-teal-500 rounded text-lg">
              Join Now
            </button>
          </div>
        </section>
        <section className="text-gray-700 body-fontw-5/6 md:w-3/4 mx-auto">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-col text-center w-full mb-20">
              <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
                Lessandra
              </h1>
              <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                Welcome to Lessandra. We're dedicated to giving you the very
                best of our homes, with a focus on affordability, durability,
                security, and a friendly community.
              </p>
            </div>
            <div className="flex flex-wrap -m-4">
              <div className="lg:w-1/3 sm:w-1/2 p-4">
                <div className="flex relative">
                  <img
                    alt="gallery"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    src="https://images.unsplash.com/photo-1597026405082-eda9beae7513?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                  />
                  <div className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
                    <h2 className="tracking-widest text-sm title-font font-medium text-teal-500 mb-1">
                      Lessandra
                    </h2>
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                      Peaceful Neighborhood
                    </h1>
                    <p className="leading-relaxed">
                      Enjoy Lessandra and its surroundings free from smog thanks
                      to the abundance of greenery. Lush plants and trees
                      surround the subdivision, providing natural air to
                      breathe.
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3 sm:w-1/2 p-4">
                <div className="flex relative">
                  <img
                    alt="gallery"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    src="https://images.unsplash.com/photo-1616113364365-b6013f3dad25?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  />
                  <div className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
                    <h2 className="tracking-widest text-sm title-font font-medium text-teal-500 mb-1">
                      Lessandra
                    </h2>
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                      Natural Scenery
                    </h1>
                    <p className="leading-relaxed">
                      Lessandra is a place of beautiful scenery of nature, no
                      skyscrapers blocking the view. The nice view together with
                      the fresh air makes mornings wonderful.
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3 sm:w-1/2 p-4">
                <div className="flex relative">
                  <img
                    alt="gallery"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    src="https://images.unsplash.com/photo-1555636222-cae831e670b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1177&q=80"
                  />
                  <div className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
                    <h2 className="tracking-widest text-sm title-font font-medium text-teal-500 mb-1">
                      Lessandra
                    </h2>
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                      Blue Skies in the Summer
                    </h1>
                    <p className="leading-relaxed">
                      Located far away from Manila, Lessandra has less exposure
                      to industrial smoke. Pure white clouds and clear blue sky
                      can be admired during great weather.
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3 sm:w-1/2 p-4">
                <div className="flex relative">
                  <img
                    alt="gallery"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    src="https://images.unsplash.com/photo-1516901408257-500ed7566e6a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  />
                  <div className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
                    <h2 className="tracking-widest text-sm title-font font-medium text-teal-500 mb-1">
                      Lessandra
                    </h2>
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                      Open Park
                    </h1>
                    <p className="leading-relaxed">
                      In the subdivision lies a park shaded by large trees. The
                      natural shade provides natural ventilation for a
                      refreshing walk around the park.
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3 sm:w-1/2 p-4">
                <div className="flex relative">
                  <img
                    alt="gallery"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    src="https://images.unsplash.com/photo-1625193308802-590eafb2ea00?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  />
                  <div className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
                    <h2 className="tracking-widest text-sm title-font font-medium text-teal-500 mb-1">
                      Lessandra
                    </h2>
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                      Reliable Security
                    </h1>
                    <p className="leading-relaxed">
                      Lessandra is guarded by Baranggay Tanod in their outpost.
                      The 24/7 security brings assurance to residents in their
                      home.
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3 sm:w-1/2 p-4">
                <div className="flex relative">
                  <img
                    alt="gallery"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    src="https://www.cloudsavvyit.com/p/uploads/2021/09/fa4a560f.jpg?width=1198&trim=1,1&bg-color=000&pad=1,1"
                  />
                  <div className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
                    <h2 className="tracking-widest text-sm title-font font-medium text-teal-500 mb-1">
                      Lessandra
                    </h2>
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                      QR Code Identification
                    </h1>
                    <p className="leading-relaxed">
                      The subdivision has a system to identify residents and
                      visitors entering the gates. With QR codes, there is
                      contactless yet reliable security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
