create proc pA_lista_proveedor
as
begin
     select 
	 idproveedor, razonsocial, dni, ruc, telefono, direccion,
	 estado
	 from proveedor
end


use SystemAlturaCoffee
go

create proc pA_guardar_proveedor(
@razonsocial varchar(30),
@dni varchar(16),
@ruc varchar(11),
@telefono varchar(8),
@direccion varchar(150),
@estado varchar(10)
) as 
begin
     insert into proveedor(razonsocial, dni, ruc, telefono, direccion, estado)
	 values (@razonsocial, @dni, @ruc, @telefono, @direccion, @estado)
end



create proc pA_editar_proveedor(
@idproveedor int,
@razonsocial varchar(30) null,
@dni varchar(16) null,
@ruc varchar(11) null,
@telefono varchar(8) null,
@direccion varchar(150) null,
@estado varchar(10) null
) as 
begin

update proveedor set

razonsocial = isnull(@razonsocial, razonsocial),
dni = isnull(@dni, dni),
ruc = isnull(@ruc, ruc),
telefono = isnull(@telefono, telefono),
direccion = isnull(@direccion, direccion),
estado = isnull(@estado, estado)
where idproveedor = @idproveedor

end


create proc pA_eliminar_proveedor(
@idproveedor int
)
as 
begin
delete from proveedor where idproveedor = @idproveedor
end