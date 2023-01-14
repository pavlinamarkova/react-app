import React, { useState, useRef } from "react";
import { PageContainer, WorkersList, Worker, WorkerForm, Buttons, TabButton, DeleteWorker, PlanButton } from "./homeStyles";
import { workers } from "./workersData";

export default function Home() {
    const WorkersCount = useRef(workers.length);
    const [listOfWorkers, setListOfWorkers] = useState(workers);
    const [activeTab, setActiveTab] = useState('list-of-workers');
    const [tempTask, setTempTask] = useState({
        meters: "",
        time: "",
    });

    const [addWorker, setAddWorker] = useState({
        id: (WorkersCount.current + 1),
        name: ""
    });

    const handleChange = (e) => {
        setAddWorker({ ...addWorker, [e.target.name]: e.target.value });
    };

    const handleAddWorker = async (e) => {
        e.preventDefault();

        await setListOfWorkers((listOfWorkers) => {
            return [...listOfWorkers, addWorker];
        });
        WorkersCount.current++;
        await setAddWorker({
            id: (WorkersCount.current + 1),
            name: "",
            sex: ""
        });
    };

    const removeWorker = (id) => {
        setListOfWorkers(listOfWorkers.filter(worker => worker.id !== id));
    };

    const taskHandle = (e) => {
        setTempTask({ ...tempTask, [e.target.name]: e.target.value });
    };

    let workMeters = 0;
    let workRequirement = tempTask.meters / tempTask.time;


    for (let i = 0; i < listOfWorkers.length; i++) {
        console.log(listOfWorkers[i]);
        if (listOfWorkers[i].sex === 'M') {
            workMeters++;
        }
        else {
            workMeters+= 0.5
        }
    }

    let infoMessage ="";
    if (workMeters>=workRequirement &&
        tempTask.meters>=1 && tempTask.time>=1){
        infoMessage = "Order your work!";

    }else if(workMeters<workRequirement &&
        tempTask.meters>=1 && tempTask.time>=1){
        infoMessage = "You need more workers!";
    }else {
        infoMessage = "";
    }

    const switchTab = (e, newValue) => {
        e.preventDefault();
        const newActiveTab = newValue;
        setActiveTab(newActiveTab);
    };

    return (
        <PageContainer>
            <h1>Planning of work</h1>
            <Buttons>
                <TabButton name='list-of-workers' activeTab={activeTab} onClick={(event) => { switchTab(event, 'list-of-workers'); }}>
                    Workers
                </TabButton>
                <TabButton name='plan-of-work' activeTab={activeTab} onClick={(event) => { switchTab(event, 'plan-of-work'); }}>
                    Planning
                </TabButton>
            </Buttons>
            {(activeTab === 'list-of-workers') &&
                <>
                    <WorkersList name="WorkerList">
                        {
                            listOfWorkers.map((worker) => (
                                <Worker key={worker.id} name={worker.name}>
                                    {worker.name} / {worker.sex}
                                    <DeleteWorker onClick={ () => { removeWorker(worker.id); }}
                                    >
                                        X
                                    </DeleteWorker>
                                </Worker>
                            ))
                        }
                    </WorkersList>
                    <WorkerForm name="WorkerForm">
                        <input
                            type="text"
                            placeholder="Name and Surname"
                            className="inputClass"
                            name="name"
                            value={addWorker.name}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            placeholder="Gender (M/F)"
                            className="inputClass"
                            name="sex"
                            value={addWorker.sex}
                            onChange={handleChange}
                        />
                        <button
                            className="inputClass"
                            onClick={handleAddWorker}
                        >
                            Add new worker
                        </button>
                    </WorkerForm>
                </>
            }
            {(activeTab === 'plan-of-work') &&
                <>
                    <WorkerForm style={{ flexDirection: 'column ' }}>
					<div
                            className="inputClass"
                            style={{ color: 'white', height: 'auto' }}
                        >
                            <h2>Planning work</h2>
                                <p>Meters to do: {tempTask.meters} m</p>
                                <p>Time: {tempTask.time} h</p> 
                                <p> {infoMessage} </p>
                                <br/>             
                        </div>                  
                        <input
                            type="number"
                            placeholder="Meters to do"
                            className="inputClass"
                            name="meters"
                            value={tempTask.meters}
                            onChange={taskHandle}
                        />
                        <input
                            type="number"
                            placeholder="Time in hours"
                            className="inputClass"
                            name="time"
                            value={tempTask.time}
                            onChange={taskHandle}
                        />
                        <br/>
                        <PlanButton
                            className="inputClass"
                            id="planButton" name="assignment" workForMeters={workMeters} conditionRequirement={workRequirement}                         
                        >
                            Order Work
                        </PlanButton>

                    </WorkerForm>
                </>
            }
        </PageContainer>
    );
}
