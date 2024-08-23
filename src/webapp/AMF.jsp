<%@page import="java.nio.charset.StandardCharsets"%>
<%@page import="java.io.FileInputStream"%>
<%@page import="java.sql.SQLException"%>
<%@page import="java.util.HexFormat,java.util.List,org.openamf.io.*,org.openamf.*"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="AMF_utils.jsp" %>
<%-- 
WIP AMF gateway. make sure to include AMF_utils.jsp and openamf & json-java JARs. 
should connect to database or maybe object storage for accounts
for a list of their commands and return types see 'future_stuff.txt'
--%>
<!DOCTYPE html> 
<html>
<head>
<meta charset="UTF-8"> 
<title>hydar AMF gateway</title>  
</head>
<body style='white-space:pre-line'>
<pre><%
%><%!static{ 
	new AMFService("echo.echo",(x)->"<<TESTCONN>>").inputs("STRING").register();
	new AMFService("game.get_data"){
		@Override
		public Object apply(List<?> args) throws SQLException{
			String uid=(String)args.get(0);
			String game=(String)args.get(1);
			return Map.of("hydar",true,"hydar2",3.0);
		}
	}
	//these represent types, we use descriptive names for strings
	//see AMFType for all the types
	.inputs("userID","gameName")
	.register();
	new AMFService("game.get_store"){
		@Override
		public Object apply(List<?> args) throws SQLException{
			String game=(String)args.get(0); 
			return JSONObject.NULL;
		}
	}.inputs("gameName").register();
	new AMFService("game.get_my_achievements"){
		@Override
		public Object apply(List<?> args) throws SQLException{
			String game=(String)args.get(0);
			String userID=(String)args.get(1);
			String token=(String)args.get(2);
			return JSONObject.NULL;
		}
	}.inputs("gameName","userID","token").register();
	new AMFService("game.save_data"){
		@Override
		public Object apply(List<?> args) throws SQLException{
			String game=(String)args.get(0);
			String userID=(String)args.get(1);
			String token=(String)args.get(2);
			Map<?,?> save=(Map<?,?>)args.get(2);
			return JSONObject.NULL;
		}
	}.inputs("gameName","userID","token","OBJECT").register();
	
	
	/**V2 AMF STUFF(mostly the same)*/
	new AMFService("v2.game.get_data"){
		@Override
		public Object apply(List<?> args) throws Exception{
			//reuse v1(todo: simplify for all the v2s with same input/output)
			return AMFService.getService("game.get_data").apply(args);
		}
	}
	.inputs("userID","gameName")
	.register();
}%>
<%
   	if(request.getMethod().equals("POST")){
   		//process POST data as sent by game etc
   		response.setContentType("application/x-amf");
   		response.resetBuffer();
   		AMFService.accept(request.getInputStream(),response.getOutputStream());
   		return; 
   	}else{
	   	//run test cases on GET
	   	//(use save request/save response in fiddler to get some test data)
	   	out.println("request: ");
	   	for(String filename: List.of("/amf_test_request.txt")){
		   	var baos=new ByteArrayOutputStream();
		   	try(InputStream file=request.getServletContext().getResourceAsStream(filename)){
		   		byte[] data=file.readAllBytes();
		   		out.println("File: "+AMFBodies.from(data));
		   		AMFService.accept(new ByteArrayInputStream(data),baos);
		   	}
		   	out.println("response: ");
		   	out.println(AMFBodies.from(baos.toByteArray()));
	   	}
		for(String filename:List.of("/amf_test_response.txt")){
		   	try(InputStream file=request.getServletContext().getResourceAsStream(filename)){
   				out.println("File: "+AMFBodies.from(file));
		   	}
		} 
   	}
    //hydar 
 %>
</pre>
</body>
</html>