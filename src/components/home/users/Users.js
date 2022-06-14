import React, {useState, useEffect,Fragment,useCallback,useMemo} from 'react';

import $ from "jquery";

import axios from 'axios';

import swal from "sweetalert";

import DataTable from 'react-data-table-component';

import {Fancybox} from "@fancyapps/ui";

import "@fancyapps/ui/dist/fancybox.css";


import Config from "../../global/Config";

import Loader from "../../global/Loader";

import Sessions from "../../global/Sessions";


import AddUser from "./AddUser";

import EditUser from "./EditUser";



const Users = (props) => {

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggledClearRows, setToggleClearRows] = useState(false); 
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState({
    nick: '',
    status: 1
  });
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const filteredItems = data.filter(

    item => (
            
      (item.nick && item.nick.toLowerCase().includes(filterText.nick.toLowerCase())) &&

      (String(item.status) && String(item.status).includes(filterText.status)) 
            
    ),
  );


  const paginationComponentOptions = {

    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos'
        
  };
    
  const columns = [

    {
      name: 'Foto',
      selector: row => (row.photo!="no posee")?<a data-fancybox={row.nick.replace(/\s+/g, '')} data-src={Config.server+"/files/"+row.photo} data-caption={row.nick}><img className="rounded-circle" src={Config.server+"/files/"+row.photo} width="50px" height="50px" style={{"margin":"5px","cursor":"pointer"}}/></a>:<img className="rounded-circle" src={"./resources/img/user.jpg"} alt={row.nick} width="55px" height="55px"/>
    },

    {
      name: 'Nick',
      selector: row => row.nick,
    },
    
    {
      name: 'Acciones',
      selector: row => <button className="btn btn-sm btn-primary" onClick={()=>edit(row.id)}><i className="fas fa-edit iconButton"></i> <b>Editar</b></button>
    }
  ];
  


  const getUsers = useCallback(event => {

    setLoading(true);

    axios({

      method: 'get',
      url: Config.server+'/users/'+Sessions.get("user").id,
      data:{},
      responseType: 'json',
      responseEncoding: 'utf8',
      headers: {'Content-Type':'application/x-www-form-urlencoded'}

    }).then((response) => {
             
      if(response.status===200){

        setData(response.data);
                
      }

      setLoading(false);

    }).catch((e) => {

      console.error(e);
    });

  }, []);

  
  const subHeaderComponentMemo = useMemo(() => {

    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText({
          nick: '',
          status: 1
        });
      }
    };

    const handleInputChange = (event) => {
           
      setFilterText({...filterText,[event.target.name] : event.target.value});
    }
        

    return (


      <div className="row">

        <div className="col-sm-12 col-md-2 col-lg-2"></div>

        <div className="col-sm-12 col-md-4 col-lg-4">

          <input
            type="text"
            className='form-control input1'
            placeholder="Nick"
            name="nick"
            value={filterText.nick}
            onChange={handleInputChange}
          />

        </div>

        <div className="col-sm-12 col-md-4 col-lg-4">

          <select name="status" className='form-control input1' value={filterText.status} onChange={handleInputChange}>
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>   

        </div>


        <div className="col-sm-12 col-md-2 col-lg-2">

          <button type="button" className="btn btn-sm btn-info" style={{"marginTop":"3px"}} onClick={handleClear}>
            <i className="fas fa-eraser iconButton"></i> <b>Limpiar</b>
          </button>

        </div>

      </div>

         
    );

  }, [filterText, resetPaginationToggle]);



  const loader = useMemo(() => {

    return (

      <div className="col-12">
  
        <center><img className="load" src="./resources/img/cargando_icon.gif" alt="cargando" width="100px" height="100px" style={{"marginTop":"10x"}}/></center>
                
      </div>
    );

  }, []);
    
    

  const handleRowSelected = useCallback(state => {

    setSelectedRows(state.selectedRows);

  }, []);


  const add=()=>{

    window.dispatchEvent(new CustomEvent("panelSlide", {
      detail: { 
                
        "action":1,
        "module":<AddUser/>,
        "options":[

          {
            "name":"Cerrar",
            "class":"btn btn-default float-left",
            "action":{"event":"closeAddUser","data":{}},
          },

          {
            "name":"Guardar",
            "class":"btn btn-primary float-left",
            "action":{"event":"addUser","data":{}},
          },

          {
            "name":"Limpiar",
            "class":"btn btn-dark float-left",
            "action":{"event":"clearAddUser","data":{}},
          }
        ]
            
      }
    }));
  }



    
  const deleteOption=()=>{

        
    Loader.on();

    axios({

      method: 'delete',
      url: Config.server+'/users',
      data: {"users":selectedRows},
      responseType: 'json',
      responseEncoding: 'utf8',
      headers: {
        'Content-Type': 'application/json'
      }

    }).then((response) => {


      Loader.off();
            

      if(response.status===200){

        setSelectedRows([]);

        setToggleClearRows(!toggledClearRows);

        window.dispatchEvent(new CustomEvent("getUsers", {detail: {}}));

        if(selectedRows.length>1){

          swal("Exito" ,"Usuarios Eliminados","success");

        }else{

          swal("Exito" ,"Usuario Eliminado","success");
        }
              
      }

    }).catch((e) =>{
        
      console.error(e);

    });

  }


  const status=(option)=>{

    Loader.on();

    axios({

      method: 'put',
      url: Config.server+'/user/'+option,
      data: {"users":selectedRows},
      responseType: 'json',
      responseEncoding: 'utf8',
      headers: {
        'Content-Type': 'application/json'
      }

    }).then((response) => {

      Loader.off();
            

      if(response.status===200){

        setSelectedRows([]);

        setToggleClearRows(!toggledClearRows);


        let message="";

        window.dispatchEvent(new CustomEvent("getUsers", {detail: {}}));


        if(selectedRows.length>1){

          if(option===0){

            message="Registros Inactivados";

          }else{

            message="Registros Activados";
          }

          swal("Exito" ,message,"success");

        }else{

          if(option===0){

            message="Registro Inactivado";

          }else{

            message="Registro Activado";
          }


          swal("Exito" ,message,"success");

        }
              
      }

    }).catch((e) => {

      console.error(e);
    });

  }


  const edit=(id)=>{

    Loader.on();

    axios({
      method: 'get',
      url: Config.server+'/user/'+id,
      data:{},
      responseType: 'json',
      responseEncoding: 'utf8',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then((response) => {

      Loader.off();
      
      if(response.status===200){

        window.dispatchEvent(new CustomEvent("panelSlide", {
          detail: { 
         
            "action":1,
            "module":<EditUser data={response.data}/>,
            "options":[

              {
                "name":"Cerrar",
                "class":"btn btn-default float-left",
                "action":{"event":"closeEditUser","data":{}},
              },

              {
                "name":"Editar",
                "class":"btn btn-primary float-left",
                "action":{"event":"editUser","data":{}},
              }
            ]
                    
          }

        }));         
      }

              
    }).catch((e) => {

      console.error(e);

    });
  }


  useEffect(() => {

    window.addEventListener('getUsers',getUsers);

    return () => {

      window.removeEventListener("getUsers", getUsers);

    };
    
  }, [getUsers]);


  useEffect(() => {

    window.dispatchEvent(new CustomEvent("getUsers", {}));
    
  }, []);



  return ( 

    <Fragment>

      <div className="content">

        <div className="panel-header bg-primary-gradient">
          <div className="page-inner py-5">
              <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                  <div>
                    <h2 className="text-white pb-2 fw-bold">Usuarios</h2>
                    <h5 className="text-white op-7 mb-2">{(Sessions.get("user"))?Sessions.get("user").nick:""} administra los usuarios</h5>
                  </div>

                  <div className="ml-md-auto py-2 py-md-0">
                    <button type='button' className="btn btn-secondary btn-round" onClick={()=>add()} ><b>Agregar Usuario</b></button>
                  </div>

              </div>
          </div>
        </div>

        <div className="page-inner mt--5">
          <div className="row mt--2">
            <div className="col-md-12">
              <div className="card full-height">
                <div className="card-body">
                  <div className="card-title">Panel de Usuarios</div>
                  <div className="container">

                    <div className="row options" style={(selectedRows.length>0)?{"display":"block"}:{"display":"none"}}>
                      <div className="col-12">
                        <button className='btn btn-sm btn-danger float-left' onClick={deleteOption}><i className="fas fa-trash iconButton"></i> <b>Eliminar</b></button>
                        <button style={(parseInt(filterText.status)===1)?{"display":"block"}:{"display":"none"}} className='btn btn-sm btn-dark float-left' onClick={()=>status(0)}><i className="far fa-eye-slash iconButton"></i> <b>Inactivar</b></button>
                        <button style={(parseInt(filterText.status)===0)?{"display":"block"}:{"display":"none"}} className='btn btn-sm btn-primary float-left' onClick={()=>status(1)}><i className="far fa-eye iconButton"></i> <b>Activar</b></button>
                      </div>
                    </div>

                    <DataTable
                      columns={columns}
                      data={filteredItems}
                      paginationComponentOptions={paginationComponentOptions}
                      onSelectedRowsChange={handleRowSelected}
                      clearSelectedRows={toggledClearRows}
                      subHeader
                      subHeaderComponent={subHeaderComponentMemo}
                      persistTableHead
                      progressPending={loading}
                      progressComponent={loader}
                      noDataComponent="No hay registros para mostrar"
                      pagination
                      selectableRows
                    />

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
 
export default Users;