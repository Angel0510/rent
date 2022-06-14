import React, {useState, useEffect,Fragment} from 'react';

import Loader from "../global/Loader";

import Sessions from "../global/Sessions";



const Dashboard = (props) => {


    return ( 

      <Fragment>

          <div className="content">

            <div className="panel-header bg-primary-gradient">
              <div className="page-inner py-5">
                  <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                      <div>
                          <h2 className="text-white pb-2 fw-bold">Inicio</h2>
                          <h5 className="text-white op-7 mb-2">{(Sessions.get("user"))?Sessions.get("user").nick:""} bienvenido al panel administrativo</h5>
                      </div>

                  </div>
              </div>
            </div>

            <div className="page-inner mt--5">
              <div className="row mt--2">
                  <div className="col-md-12">
                      <div className="card full-height">
                          <div className="card-body">
                              <div className="card-title">Panel de Inicio</div>
                              <div className="card-category">Daily information about statistics in system</div>
                              <div className="container">
                            
                                <div className="row">
                                    <div className="col-sm-6 col-md-3">
                                      <div className="card card-stats card-round">
                                        <div className="card-body ">
                                          <div className="row align-items-center">
                                            <div className="col-icon">
                                              <div className="icon-big text-center icon-primary bubble-shadow-small">
                                                <i className="flaticon-users"></i>
                                              </div>
                                            </div>
                                            <div className="col col-stats ml-3 ml-sm-0">
                                              <div className="numbers">
                                                <p className="card-category">Usuarios</p>
                                                <h4 className="card-title">1,294</h4>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-6 col-md-3">
                                      <div className="card card-stats card-round">
                                        <div className="card-body">
                                          <div className="row align-items-center">
                                            <div className="col-icon">
                                              <div className="icon-big text-center icon-info bubble-shadow-small">
                                                <i className="flaticon-interface-6"></i>
                                              </div>
                                            </div>
                                            <div className="col col-stats ml-3 ml-sm-0">
                                              <div className="numbers">
                                                <p className="card-category">Clientes</p>
                                                <h4 className="card-title">1303</h4>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-6 col-md-3">
                                      <div className="card card-stats card-round">
                                        <div className="card-body">
                                          <div className="row align-items-center">
                                            <div className="col-icon">
                                              <div className="icon-big text-center icon-success bubble-shadow-small">
                                                <i className="flaticon-graph"></i>
                                              </div>
                                            </div>
                                            <div className="col col-stats ml-3 ml-sm-0">
                                              <div className="numbers">
                                                <p className="card-category">Pagos Abril</p>
                                                <h4 className="card-title">$ 1,345</h4>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-6 col-md-3">
                                      <div className="card card-stats card-round">
                                        <div className="card-body">
                                          <div className="row align-items-center">
                                            <div className="col-icon">
                                              <div className="icon-big text-center icon-secondary bubble-shadow-small">
                                                <i className="flaticon-alarm-1"></i>
                                              </div>
                                            </div>
                                            <div className="col col-stats ml-3 ml-sm-0">
                                              <div className="numbers">
                                                <p className="card-category">Alertas</p>
                                                <h4 className="card-title">576</h4>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

      </Fragment>
        
        
    );
}
 
export default Dashboard;