import { useApp } from "../../components/context";
import { Background, TowStatusComponent } from "../../components/components";

const TowStatus = () =>
{
    const { towRequest, client, setTowRequest } = useApp();

    return (
        <Background>
            <TowStatusComponent towRequest={towRequest} client={client} setTowRequest={setTowRequest}/>
        </Background>
    );
};

export default TowStatus;