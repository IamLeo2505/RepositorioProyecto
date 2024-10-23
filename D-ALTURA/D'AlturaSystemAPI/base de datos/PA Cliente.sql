create proc pA_lista_clientes
as
begin
     select 
	 idcliente, nombre, apellidos, dni, telefono, ruc,
	 estado
	 from cliente
end


create proc pA_guardar_cliente(
@nombre varchar(50),
@apellidos varchar(50),
@ruc varchar(11),
@telefono varchar(8),
@dni varchar(16),
@estado varchar(10)
) as 
begin
     insert into cliente(nombre, apellidos, dni, telefono, ruc, estado)
	 values (@nombre, @apellidos, @dni, @telefono, @ruc, @estado)
end



create proc pA_editar_cliente(
@idcliente int,
@nombre varchar(50) null,
@apellidos varchar(50) null,
@dni varchar(16) null,
@telefono varchar(8) null,
@ruc varchar(11) null,
@estado varchar(10) null
) as 
begin

update cliente set

nombre = isnull(@nombre, nombre),
dni = isnull(@dni, dni),
ruc = isnull(@ruc, ruc),
telefono = isnull(@telefono, telefono),
apellidos = isnull(@apellidos, apellidos),
estado = isnull(@estado, estado)
where idcliente = @idcliente

end


create proc pA_eliminar_cliente(
@idcliente int
)
as 
begin
     update cliente
	 set activo = 0
	 where idcliente = @idcliente;
end