import MapImg from "../assets/map.svg"
import GitHubButton from 'react-github-btn'

const HomePage = () => {
    return (
        <section className="text-gray-600 body-font">
            <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
            <img className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded" alt="hero" src={MapImg} />
                <div className="text-center lg:w-2/3 w-full">
                    <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Prepare for future hurricanes now!</h1>
                        <p className="mb-8 leading-relaxed">Hurricane Damage Detector is a tool that allows users to map out previous hurricanes to study their path of destruction as well as produce accurate, live data of hurricanes forming currently. Ultimately, allowing users to prepare themselves in sufficient time if a hurricane is aligned with them.</p>
                            <div className="flex justify-center">
                                <GitHubButton data-size="large" href="https://github.com/jacobduncan00/hackmit2021">See Code</GitHubButton>
                            </div>
                </div>
            </div>
        </section>
    )
}

export default HomePage;
