import React, {useState, useEffect,Fragment,useMemo} from 'react';

import Form from "./Form";

const Poll = () => {

  const pollOne = {

    initialValues:{name:'',lastName:'',email:''},

    body:(options)=> useMemo(() => {

      return (
        
        <Fragment>

          <div className="form-group">

            <label>Nombre: <small className="text-danger"><b>*</b></small></label>

            <input

              className="form-control inpu-text"

              type="text"

              name="name"

              onChange={options.handleChange}

              onBlur={options.handleBlur}

              value={options.values.name}

            />

            <small className="form-text text-danger"><b>{options.errors.name && options.touched.name && options.errors.name}</b></small>
          
          </div>

          <div className="form-group">

            <label>Apellido: </label>

            <input

              className="form-control inpu-text"

              type="text"

              name="lastName"

              onChange={options.handleChange}

              onBlur={options.handleBlur}

              value={options.values.lastName}

            />

           
          </div>


          <div className="form-group">

            <label>Email: <small className="text-danger"><b>*</b></small></label>

            <input

              className="form-control inpu-text"

              type="email"

              name="email"

              onChange={options.handleChange}

              onBlur={options.handleBlur}

              value={options.values.email}

            />

            <small className="form-text text-danger"><b>{options.errors.email && options.touched.email && options.errors.email}</b></small>
          
          </div>


          <center><button type="button" className="btn btn-primary" type="submit" disabled={options.isSubmitting}><b>Enviar</b></button></center>

        </Fragment>
      );

    }, [options]),

    validate:values=>{

      const errors = {};

      if(!values.name) {

        errors.name = 'Nombre requerido';

      }

      if (!values.email){

        errors.email = 'Email requerido';

      }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)){

        errors.email = 'Email invalido';
      }

      return errors;
    },

    onSubmit:(values, { setSubmitting }) => {

        setTimeout(() => {

          alert(JSON.stringify(values, null, 2));

          setSubmitting(false);

        }, 400);

      }

  };




  const pollTwo = {

    initialValues:{student:'',matter:'Matematica',qualification:'C'},

    body:(options)=> useMemo(() => {


      const matters=[

        "Matematica",
        "Fisica",
        "Ingles"
      ];

      return (
        
        <Fragment>

          <div className="form-group">

            <label>Estudiante: <small className="text-danger"><b>*</b></small></label>

            <input

              className="form-control inpu-text"

              type="text"

              name="student"

              onChange={options.handleChange}

              onBlur={options.handleBlur}

              value={options.values.student}

            />

            <small className="form-text text-danger"><b>{options.errors.student && options.touched.student && options.errors.student}</b></small>
          
          </div>

          <div className="form-group">

            <label>Materia</label>

            <select 

              className="form-control inpu-text"

              name="matter"

              onChange={options.handleChange}

              onBlur={options.handleBlur}

              value={options.values.matter}

              >

              {matters.map(m =>(

                <option value={m}>{m}</option>

              ))}

            </select>
            
          </div>

          <div className="form-group">

          <label>Calificación:</label> <br/>

          <div className="form-check-inline">
            <label className="form-check-label">
              <input 

              className="form-check-input"

              type="radio"  

              name="qualification"

              onChange={options.handleChange}

              onBlur={options.handleBlur}

              value="A"

              checked={options.values.qualification=="A"}/> A

            </label>
          </div>
        

          <div className="form-check-inline">
            <label className="form-check-label">
              <input 

              className="form-check-input"

              type="radio"  

              name="qualification"

              onChange={options.handleChange}

              onBlur={options.handleBlur}

              value="B"

              checked={options.values.qualification=="B"}/> B

            </label>
          </div>



          <div className="form-check-inline">
            <label className="form-check-label">
              <input 

              className="form-check-input"

              type="radio"  

              name="qualification"

              onChange={options.handleChange}

              onBlur={options.handleBlur}

              value="C"

              checked={options.values.qualification=="C"}/> C

            </label>
          </div>
          
          </div>


          <center><button type="button" className="btn btn-primary" type="submit" disabled={options.isSubmitting}><b>Enviar</b></button></center>

        </Fragment>
      );

    }, [options]),

    validate:values=>{

      const errors = {};

      if(!values.student) {

        errors.student = 'Estudiante requerido';

      }

      return errors;
    },

    onSubmit:(values, { setSubmitting }) => {

        setTimeout(() => {

          alert(JSON.stringify(values, null, 2));

          setSubmitting(false);

        }, 400);

      }

  };



  return ( 

    <Fragment>

      <div className="content">

        <div className="panel-header bg-primary-gradient">
          <div className="page-inner py-5">
              <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                  <div>
                    <h2 className="text-white pb-2 fw-bold">Encuesta:</h2>
                    <h5 className="text-white op-7 mb-2"> Administra las encuestas</h5>
                  </div>

              </div>
          </div>
        </div>

        <div className="page-inner mt--5">
          <div className="row mt--2">
            <div className="col-md-12">
              <div className="card full-height">
                <div className="card-body">
                  <div className="card-title">Encuesta</div>
                  <div className="container">

                    <h3>Formulario 1</h3>

                    <Form data={pollOne}/>

                    <h3>Formulario 2</h3>

                    <Form data={pollTwo}/>

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
 
export default Poll;