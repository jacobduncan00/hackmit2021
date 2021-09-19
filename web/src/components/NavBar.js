import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import HomePage from "./HomePage"
import Map from "./Map"
import LiveMap from "./LiveMap"
import BasicForm from "./Survey"
import Logo from "../assets/jenna_hurricane.svg"

const NavBar = () => {
    return (
        <Router>
            <header className="text-gray-600 body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    <img src={Logo} height={30} width={30}/>
                    <Link to="/home">
                        <span className="ml-3 text-xl">Hurricane Damage Detector</span>
                    </Link>
                </a>
                <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
                    <a className="mr-5 hover:text-gray-900"><Link className="mr-5 hover:text-gray-900" to="/live-map">Live Hurricanes</Link></a>
                    <a className="mr-5 hover:text-gray-900"><Link className="mr-5 hover:text-gray-900" to="/map">Past Hurricanes</Link></a>
                    <a className="mr-5 hover:text-gray-900"><Link className="mr-5 hover:text-gray-900"to="/survey">Questionnaire</Link></a>
                </nav>
            </div>
            </header>
            <Switch>
                <Route path="/map">
                    <Map />
                </Route>
                <Route path="/live-map">
                    <LiveMap />
                </Route>
                <Route path="/survey">
                    <BasicForm />
                </Route>
                <Route path="/">
                    <HomePage />
                </Route>
            </Switch>
        </Router>
    )
}

export default NavBar