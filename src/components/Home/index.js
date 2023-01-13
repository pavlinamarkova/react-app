import React, { useState, useRef, useEffect } from "react";
import { PageContainer, WorkersList, Worker, WorkerForm, Buttons, TabButton, DeleteWorker, PlanButton } from "./homeStyles";
import { workers } from "./workersData";

export default function Home() {

    const WorkersCount = useRef(workers .length);
    const [listOfWorkers, setListOfWorkers] = useState(workers);
    const [activeTab, setActiveTab] = useState('list-of-workers');
    const [storeTask, setStoreTask] = useState({
        meters: 0,
        time: 0
    });
    const [tempStoreTask, setTempStoreTask] = useState({
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

    const RemoveEmployee = (id) => {

        setListOfWorkers(listOfWorkers.filter(worker => worker.id != id));
    };

    const taskManagement = (e) => {
        setTempStoreTask({ ...tempStoreTask, [e.target.name]: e.target.value });
    };

    const addTask = async () => {
        const storageValue = tempStoreTask;
        let newStoreTask = {};
        const keys = Object.keys(storageValue);
        keys.map((key) => {
            if (Number(storageValue[key])) {
                newStoreTask[key] = Number(storageValue[key]);
            }
            else {
                newStoreTask[key] = Number(storeTask[key]);
            }
        });
        console.log(newStoreTask);
        await setStoreTask(newStoreTask);
        await setTempStoreTask({ meters: "", time: "" });

    };

    let workforceMeters = 0;
    let workforceRequirement = storeTask.meters / storeTask.time;

    for (let i = 0; i < listOfWorkers.length; i++) {
        console.log(listOfWorkers[i]);
        if (listOfWorkers[i].sex === 'M') {
            workforceMeters++;
        }
        else {
            workforceMeters += 0.5
        }
    }

	console.log(`Meters done in 1 hour: ${workforceMeters}`)
    console.log(`Meters required in 1 hour: ${(storeTask.meters / storeTask.time)}`)
    if (workforceMeters >= storeTask.meters / storeTask.time) {
        console.log("Enough workforce")
    }
    else {
        console.log("Not enough workforce!")
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
                            listOfWorkers.map((employee) => (
                                <Worker key={employee.id} name={employee.name}>
                                    {employee.name} / {employee.sex}
                                    <DeleteWorker
                                        onClick={() => { RemoveEmployee(employee.id); }}
                                    >
                                        🗙
                                    </DeleteWorker>
                                </Worker>
                            ))
                        }
                    </WorkersList>
                    <WorkerForm name="employeeForm">
                        <input
                            type="text"
                            placeholder="Jméno zaměstnance"
                            className="inputClass"
                            name="name"
                            value={addWorker.name}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            placeholder="Pohlaví zaměstnance (M/F)"
                            className="inputClass"
                            name="sex"
                            value={addWorker.sex}
                            onChange={handleChange}
                        />
                        <button
                            className="inputClass"
                            onClick={handleAddWorker}
                        >
                            Přidat
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
                            <h2>Aktuální Úkol</h2>
                          
                                <p>Meters tp do: {storeTask.meters} m</p>
                                <p>Time: {storeTask.time} h</p>
                            
                        </div>
                       
                        <input
                            type="number"
                            placeholder="meters to do"
                            className="inputClass"
                            name="meters"
                            value={tempStoreTask.meters}
                            onChange={taskManagement}
                        />
                        <input
                            type="number"
                            placeholder="Time in hours"
                            className="inputClass"
                            name="time"
                            value={tempStoreTask.time}
                            onChange={taskManagement}
                        />
                        <PlanButton
                            className="inputClass"
                            id="planButton" name="assignment" employeePerformance={workforceMeters} conditionRequirement={workforceRequirement}
                            onClick={addTask}
                        >
                            Planning
                        </PlanButton>
                    </WorkerForm>
                </>
            }
        </PageContainer>
    );
}