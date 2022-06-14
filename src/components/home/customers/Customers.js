import React, {useState, useEffect,Fragment} from 'react';

import Loader from "../../global/Loader";

import Sessions from "../../global/Sessions";


const Customers = (props) => {


    return ( 

      <Fragment>

          <div className="content">

            <div className="panel-header bg-primary-gradient">
              <div className="page-inner py-5">
                  <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                      <div>
                          <h2 className="text-white pb-2 fw-bold">Clientes</h2>
                          <h5 className="text-white op-7 mb-2">{(Sessions.get("user"))?Sessions.get("user").nick:""} administra los clientes</h5>
                      </div>

                  </div>
              </div>
            </div>

            <div className="page-inner mt--5">
              <div className="row mt--2">
                  <div className="col-md-12">
                      <div className="card full-height">
                          <div className="card-body">
                              <div className="card-title">Panel de clientes</div>
                              <div className="container">
                            
                                <div className="row">
                            
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
 
export default Customers;