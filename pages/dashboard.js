import Profile from '../components/profile';
import Splash from '../components/Splash';

const Dashboard = () => {
    return(
        <div className="flex flex-col w-full">
            <Splash />
            <div className="flex flex-row w-full">
                <Profile />
                <Profile />
                <Profile />
                <Profile />
            </div>
        </div>
    );
}

export default Dashboard