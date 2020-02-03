<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.io.PrintWriter"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width" initial-scale="1">
<link rel="stylesheet" href="css/bootstrap.css">
<link rel="stylesheet" href="css/custom.css">
<title>JSP web board page</title>
</head>
<body>
	<%
		String userID = null;
		if (session.getAttribute("userID") != null){
			userID = (String) session.getAttribute("userID");
		}	
	%>
	<nav class="navbar navbar-default">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed"
				data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"
				aria-expanded="false">
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="main.jsp">JSP web board page</a>
		</div>
		<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
			<ul class="nav navbar-nav">
				<li class="active"><a href="main.jsp">Main</a></li>
				<li><a href="bbs.jsp">BBS</a></li>
			</ul>
			<%
				if(userID == null){
					
			%>
			<ul class="nav navbar-nav navbar-right">
				<li class="dropdown">
					<a href="#" class="dropdown-toggle" data-toggle="dropdown"
						role="button" aria-haspopup="true" aria-expanded="false">
						Access<span class="caret"></span></a>
				
					<ul class="dropdown-menu">
						<li><a href="login.jsp">Login</a></li>
						<li><a href="join.jsp">Sign Up</a></li>
					</ul>
				</li> 
			</ul>
			<%
				} else {
			
			%>
				<ul class="nav navbar-nav navbar-right">
				<li class="dropdown">
					<a href="#" class="dropdown-toggle" data-toggle="dropdown"
						role="button" aria-haspopup="true" aria-expanded="false">
						Member Management<span class="caret"></span></a>
				
					<ul class="dropdown-menu">
						<li><a href="logoutAction.jsp">Logout</a></li>
					
					</ul>
				</li>
			</ul>
			<%
				}
			%>
			
			
		</div>
	</nav>
	<div class="container">
		<div class="jumbotron">
			<div class="container">
				<h1>Elly's BBS</h1>
				<p>This Web page is built by bootstrap and JSP.
				<br> You can Sign-up and write something on the BBS with your ID.
				<br> You should sign-in first before using the BBS</p>
				<hr style = "border: 1px solid #dddddd">
				<p>Thank you for visiting my web-page</p>
					<div class="container">
						<img src="images/avatar.png">				
					</div>			
				<br>
				
				<div class="container">
					<table>
						<tr>
						<td></td>
						<td></td>
						<td></td>
						</tr>
					</table>
				</div>
				<p><a class="btn btn-info pull-right" href="#" role="button">Learn more</a></p>
				
			</div>
		</div>
	</div>
	

	<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
	<script src="js/bootstrap.js"></script>
</body>
</html>