create proc pA_lista_empleados
as
begin
     select 
	 idempleado, nombre, apellidos, dni, telefono, direccion, estado
	 from empleado
end


CREATE PROCEDURE pA_guardar_empleado(
@nombre varchar(50),
@apellidos varchar(50),
@dni varchar(16),
@telefono varchar(8),
@direccion varchar(150),
@estado varchar(10)
) as 
begin
     insert into empleado(nombre, apellidos, dni, telefono, direccion, estado)
	 values (@nombre, @apellidos, @dni, @telefono, @direccion, @estado)
end



create proc pA_editar_empleado(
@idempleado int,
@nombre varchar(50) null,
@apellidos varchar(50) null,
@dni varchar(16) null, 
@telefono varchar(8)  null, 
@direccion varchar(150)  null, 
@estado varchar(10)
) as 
begin

update empleado set

nombre = isnull(@nombre, nombre),
apellidos = isnull(@apellidos, apellidos),
dni = isnull(@dni, dni),
telefono = isnull(@telefono, telefono),
direccion = isnull(@direccion, direccion),
estado = isnull(@estado, estado)
where idempleado = @idempleado

end


create proc pA_eliminar_empleado(
@idempleado int
)
as 
begin
delete from empleado where idempleado = @idempleado
end

select * from empleado