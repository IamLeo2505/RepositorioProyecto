create proc [dbo].[pA_Empleado_For_Usuario]
as
begin
     select 
	 idempleado, nombre, apellidos
	 from empleado
end
GO