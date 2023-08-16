import React, {useState} from "react";
import {Accordion, Heading, Ingress, Label} from "@digdir/design-system-react";
import withAuth, {AuthProps} from "../auth/withAuth";
import {useClients, useScopes} from "../../hooks/api";
import styles from './styles.module.scss';
import ScopeDetails from "./ScopeDetails/ScopeDetails";
import ContentContainer from "../common/ContentContainer/ContentContainer";
import OnboardingCard from "./OnboardingCard/OnboardingCard";
import {useQueryClient} from "@tanstack/react-query";

function Dashboard({ id, config }: AuthProps) {
    const queryClient = useQueryClient();
    const [minLoadtimeOver, setMinLoadtimeOver] = useState(false);
    const [env, setEnv] = useState(Object.keys(config)[0]);
    const { data: scopesData, isLoading: isScopesLoading } = useScopes(env);
    const { data: clientsData, isLoading: isClientsLoading } = useClients(env);
    const isLoading = isScopesLoading || isClientsLoading || !minLoadtimeOver;

    setTimeout(() => setMinLoadtimeOver(true), 600);

    const onEnvChanged = (env: string) => {
        setEnv(env);
        queryClient.clear();
    }

    const environments= (index: number) => {
        return Object.keys(config)[index];
    }

    return (
        <ContentContainer>
            <div className={styles.infoContainer} >
                <Heading size={"large"}>
                    API-tilganger i Maskinporten
                </Heading>
                <Ingress>
                    Her kan du se API-tilganger gitt til {id.authorization_details[0].reportees[0].Name} .
                </Ingress>
                <OnboardingCard />
            </div>

            <div className={styles.accordionListHeader}>
                <Heading size={"small"}>
                    API-tilganger
                </Heading>
                <div className={styles.envPicker}>
                    <Label>
                        Valgt miljø:
                    </Label>
                    <div className={styles.picker}>
                        <button className={`${env === environments(0) ? styles.active : ""}`}
                                onClick={() => onEnvChanged(environments(0))}
                        >
                            {environments(0).toUpperCase()}
                        </button>
                        <button className={`${env === environments(1) ? styles.active : ""}`}
                                onClick={() => onEnvChanged(environments(1))}
                        >
                            {environments(1).toUpperCase()}
                        </button>
                    </div>
                </div>
            </div>
            <Accordion color={"neutral"}>
                {
                    isLoading &&
                    <>
                        <span className={styles.skeleton} />
                        <span className={styles.skeleton} />
                    </>

                }
                {
                    !isLoading &&
                    clientsData &&
                    scopesData &&
                    scopesData.map(scope => <ScopeDetails scope={scope} clients={clientsData} env={env} key={scope.scope} />)
                }
            </Accordion>
        </ContentContainer>
    )
}

export default withAuth(Dashboard);