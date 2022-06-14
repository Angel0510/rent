import React, {Fragment,useEffect,useState,useCallback} from 'react';

import Loader from "../global/Loader";

import Config from "../global/Config";

import Sessions from "../global/Sessions";

import PanelSide from "../global/PanelSide";

import EditUser from "./users/EditUser";


const Home = (props) => {

	const [user, setUser] = useState(null);


	const goOut = () => {

    	Sessions.remove("user");

        window.location.href="/";
    }


    const profile = ()=>{

    	window.dispatchEvent(new CustomEvent("panelSlide", {
          detail: { 
         
            "action":1,
            "module":<EditUser data={user}/>,
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


    const set= useCallback(event => {

       var data= event.detail;

       Sessions.set("user",data);

       setUser(data);

    }, []);


    useEffect(() => {

	    window.addEventListener('user',set);

	    return () => {

	      window.removeEventListener("user",set);

	    };
	    
	 }, [set]);


	useEffect(() => {

		if(!Sessions.get("user")){

	        window.location.href="/";
	          
	    }else{

	    	console.log(Sessions.get("user"));

			setUser(Sessions.get("user"));

	        Loader.off();
	    }

	 }, []);

    return (

        <Fragment>

	        <div className="main-header">

				<div className="logo-header" data-background-color="blue">
					
					<a href="index.html" className="logo">
						<img src="./resources/template/examples/assets/img/logo.svg" alt="navbar brand" className="navbar-brand"/>
					</a>
					<button className="navbar-toggler sidenav-toggler ml-auto" type="button" data-toggle="collapse" data-target="collapse" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon">
							<i className="icon-menu"></i>
						</span>
					</button>
					<button className="topbar-toggler more"><i className="icon-options-vertical"></i></button>
					<div className="nav-toggle">
						<button className="btn btn-toggle toggle-sidebar">
							<i className="icon-menu"></i>
						</button>
					</div>
				</div>

				<nav className="navbar navbar-header navbar-expand-lg" data-background-color="blue2">
					
					<div className="container-fluid">

						<ul className="navbar-nav topbar-nav ml-md-auto align-items-center">
							<li className="nav-item toggle-nav-search hidden-caret">
								<a className="nav-link" data-toggle="collapse" href="#search-nav" role="button" aria-expanded="false" aria-controls="search-nav">
									<i className="fa fa-search"></i>
								</a>
							</li>
					
					
						
							<li className="nav-item dropdown hidden-caret">
								<a className="dropdown-toggle profile-pic" data-toggle="dropdown" href="#" aria-expanded="false">
									<div className="avatar-sm">
										{(user && user.photo!="no posee")?<img className="avatar-img rounded-circle" src={Config.server+"/files/"+user.photo} alt={user.nick}  style={{"margin":"5px","cursor":"pointer"}}/>:<img className="avatar-img rounded-circle" src={"./resources/img/user.jpg"} alt=""/>}
									</div>
								</a>
								<ul className="dropdown-menu dropdown-user animated fadeIn">
									<div className="dropdown-user-scroll scrollbar-outer">
										<li>
											<div className="user-box">
												<div className="avatar-lg">{(user && user.photo!="no posee")?<img className="avatar-img rounded-circle" src={Config.server+"/files/"+user.photo} alt={user.nick}  style={{"margin":"5px","cursor":"pointer"}}/>:<img className="avatar-img rounded-circle" src={"./resources/img/user.jpg"} alt=""/>}</div>
												<div className="u-text">
													<h4>{(user)?user.nick:""}</h4>
													<a href="#" onClick={profile} className="btn btn-xs btn-secondary btn-sm">Ver Perfil</a>
												</div>
											</div>
										</li>
										<li>
											<div className="dropdown-divider"></div>
											<a className="dropdown-item" href="#" onClick={profile}>Mi Perfil</a>
											<div className="dropdown-divider"></div>
											<a className="dropdown-item" href="#" onClick={goOut}>Cerrar Sesión</a>
										</li>
									</div>
								</ul>
							</li>
						</ul>
					</div>
				</nav>

			</div>


			<div className="sidebar sidebar-style-2">			
				<div className="sidebar-wrapper scrollbar scrollbar-inner">
					<div className="sidebar-content">
						<div className="user">
							<div className="avatar-sm float-left mr-2">
								{(user && user.photo!="no posee")?<img className="avatar-img rounded-circle" src={Config.server+"/files/"+user.photo} alt={user.nick} style={{"margin":"5px","cursor":"pointer"}}/>:<img className="avatar-img rounded-circle" src={"./resources/img/user.jpg"} alt=""/>}
							</div>
							<div className="info">
								<a data-toggle="collapse" href="#collapseExample" aria-expanded="true">
									<span>
										{(user)?user.nick:""}
										<span className="user-level">Administrator</span>
										<span className="caret"></span>
									</span>
								</a>
								<div className="clearfix"></div>

								<div className="collapse in" id="collapseExample">
									<ul className="nav">
										<li>
											<a href="#" onClick={profile}>
												<span className="link-collapse">Mi Perfil</span>
											</a>
										</li>
										<li>
											<a href="#" onClick={goOut}>
												<span className="link-collapse">Cerrar Sesión</span>
											</a>
										</li>
									
									</ul>
								</div>
							</div>
						</div>
						<ul className="nav nav-primary">
	            <li className={(props.main.type.name==="Dashboard")?"nav-item active":"nav-item"}>
								<a href="home">
	                <i className="fas fa-home"></i>
									<p>Inicio</p>
								</a>
							</li>
							<li className="nav-section">
								<span className="sidebar-mini-icon">
									<i className="fa fa-ellipsis-h"></i>
								</span>
								<h4 className="text-section">Gestion</h4>
							</li>

	        
					
			
							<li className={(props.main.type.name==="Users")?"nav-item active":"nav-item"}>
								<a href="users">
	                				<i className="fas fa-users"></i>
									<p>Usuarios</p>
									<span className="badge badge-success">0</span>
								</a>
							</li>


							<li className={(props.main.type.name==="Products")?"nav-item active":"nav-item"}>
								<a href="products">
							
	                				<i className="fab fa-product-hunt"></i>
									<p>Productos</p>
									<span className="badge badge-success">0</span>
								</a>
							</li>


				            <li className={(props.main.type.name==="Customers")?"nav-item active":"nav-item"}>
								<a href="customers">
				              		<i className="fas fa-address-book"></i>
									<p>Clientes</p>
									<span className="badge badge-success">0</span>
								</a>
							</li>


							<li className={(props.main.type.name==="Poll")?"nav-item active":"nav-item"}>
								<a href="poll">
				              		<i className="fas fa-address-book"></i>
									<p>Encuestas</p>
									<span className="badge badge-success">0</span>
								</a>
							</li>
					
					
						</ul>
					</div>
				</div>
			</div>

			<div className="main-panel">

                {props.main}

                <footer className="footer">
					<div className="container-fluid">
						<nav className="pull-left">
							<ul className="nav">
								<li className="nav-item">
		             Martes 04 de abril del 2022
								</li>
								<li className="nav-item">
										
								</li>
								<li className="nav-item">
										
								</li>
							</ul>
						</nav>
						<div className="copyright ml-auto">
		           			<b>9:39 PM</b>
						</div>				
					</div>
				</footer>
                
            </div>


            <PanelSide/>
            
            
        </Fragment>
    );
}
 
export default Home;
