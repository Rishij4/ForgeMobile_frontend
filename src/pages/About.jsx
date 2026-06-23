// About.jsx
import Navbar from "../components/layout/Navbar";

const techStack = ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Gemini AI API"];

const About = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <section className="max-w-6xl mx-auto px-10 py-20">
        {/* Heading */}
        <h1 className="text-6xl font-bold mb-8">ABOUT FORGEMOBILE</h1>

        {/* Main Story */}
        <div className="bg-gray-900 rounded-3xl p-10 border border-gray-800 mb-16">
          <p className="text-xl text-gray-300 leading-10">
            ForgeMobile reimagines how smartphones should be purchased. Instead of forcing users to buy pre-built devices with fixed hardware combinations, ForgeMobile allows users to design a smartphone from the hardware level itself. 
            Users can customize processor, RAM, storage, battery, display technology, camera systems, connectivity modules, sensors and additional hardware components.
            Our AI engine analyzes compatibility, performance, battery efficiency, thermal behavior and compares real-world market pricing. Build smarter. Build personal.
          </p>
        </div>

        {/* Vision Section */}
        <h2 className="text-4xl font-bold mb-8 text-indigo-400">OUR VISION</h2>
        <div className="bg-gray-950 p-8 rounded-3xl border border-gray-800 mb-16">
          <p className="text-gray-400 text-lg leading-9">
            We believe smartphones should adapt to the user — not force users to adapt to hardware decisions made by manufacturers. 
            ForgeMobile introduces complete smartphone customization powered by intelligent hardware analysis.
          </p>
        </div>

        {/* Tech Stack */}
        <h2 className="text-4xl font-bold mb-8 text-indigo-400">TECHNOLOGY STACK</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {techStack.map((tech, index) => (
            <div key={index} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-indigo-500 transition">
              <h3 className="text-xl font-semibold">{tech}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;