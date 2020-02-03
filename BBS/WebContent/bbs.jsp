<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.io.PrintWriter"%>
<%@ page import="bbs.BbsDAO"%>
<%@ page import="bbs.Bbs"%>
<%@ page import="java.util.ArrayList"%>
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
		int pageNumber = 1;
		if(request.getParameter("pageNumber") != null){
			pageNumber = Integer.parseInt(request.getParameter("pageNumber"));
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
				<li><a href="main.jsp">Main</a></li>
				<li class="active"><a href="bbs.jsp">BBS</a></li>
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
	 <div class = "container">
		 <div class="row">
		 	<table class="table table-striped" style="text-align: center; border: 1px solid #dddddd">	
		 		<thead>
		 			<tr>
		 				<th style="background-color: #eeeeee; text-align: center;">Number</th>
		 				<th style="background-color: #eeeeee; text-align: center;">Title</th>
		 				<th style="background-color: #eeeeee; text-align: center;">Writer</th>
		 				<th style="background-color: #eeeeee; text-align: center;">Date</th>
		 			</tr>
		 		</thead>
		 		<tbody>
			 		<%
			 			BbsDAO bbsDAO = new BbsDAO();
			 			ArrayList<Bbs> list = bbsDAO.getList(pageNumber);
			 			for(int i = 0; i < list.size(); i++){
			 		%>		
			 			<tr>
			 				<td><%= list.get(i).getBbsID() %></td>
			 				<td><a href="view.jsp?bbsID=<%= list.get(i).getBbsID() %>"><%= list.get(i).getBbsTitle().replaceAll(" ", "&nbsp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\n", "<br>") %></a></td>
			 				<td><%= list.get(i).getUserID() %></td>
			 				<td><%= list.get(i).getBbsDate().substring(0, 16) %></td>
			 				
			 			</tr>
			 			
			 		<%
			 			}
			 		%> 
		 		</tbody>
		 	</table>
		 	<%
		 		if(pageNumber != 1){
		 	%>
				 <a href="bbs.jsp?pageNumber=<%=pageNumber - 1%>" class="btn btn-outline btn-arrow-left">Previous</a>		
		 	<%
		 		}if(bbsDAO.nextPage(pageNumber + 1)){
		 	%>
		 		<a href="bbs.jsp?pageNumber=<%=pageNumber + 1%>" class="btn btn-outline btn-arrow-left">Next</a>
		 	<%
		 		}
		 	%>
		 	<a href="write.jsp" class="btn btn-outline pull-right">Write</a>
		 </div>
	 </div>
	<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
	<script src="js/bootstrap.js"></script>
</body>
</html>