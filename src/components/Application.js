import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import getAppointmentsForDay from "helpers/selectors";


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });


  useEffect(() => {
    const hostURL = "http://localhost:8001";
    const days = axios.get(`${hostURL}/api/days`);
    const appointments = axios.get(`${hostURL}/api/appointments`);
    const interviewers = axios.get(`${hostURL}/api/interviewers`);
    const promises = [days, appointments, interviewers];

    Promise.all(promises)
      .then((promisesArray) => {
        setState(prev => ({ ...prev, days: promisesArray[0].data, appointments: promisesArray[1].data, interviewers: promisesArray[2].data }));
      });
  }, []);


  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const appointmentArray = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        {...appointment}
        interview={interview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} value={state.day} onChange={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentArray}
      </section>
    </main>
  );
};
