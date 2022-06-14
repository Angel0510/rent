import React, {useState, useEffect,Fragment,useCallback,useMemo} from 'react';
import { Formik } from 'formik';


const Form = (props) => {

  return ( 

   
    <Formik

      initialValues={props.data.initialValues}

      validate={props.data.validate}

      onSubmit={props.data.onSubmit}>

        {({

        values,

        errors,

        touched,

        handleChange,

        handleBlur,

        handleSubmit,

        isSubmitting,

        }) => (

          <form onSubmit={handleSubmit}>

            {props.data.body({

            values,

            errors,

            touched,

            handleChange,

            handleBlur,

            handleSubmit,

            isSubmitting,

            })}

            

          </form>

        )}

    </Formik>
        
  );

}
 
export default Form;