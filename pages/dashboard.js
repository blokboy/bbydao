import Splash from '../components/Splash';
import ProfilesContainer from '../components/ProfilesContainer';

const Dashboard = () => {
    return(
        <div className="flex flex-col w-screen">
            <Splash />
            <ProfilesContainer />
        </div>
    );
}

export default Dashboard