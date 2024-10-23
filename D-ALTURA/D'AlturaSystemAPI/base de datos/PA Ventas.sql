create proc pA_lista_venta
as
begin
     select 
	 idventa, fecha, serie, num_documento, subtotal, iva, total, estado, idusuario, idcliente
	 from venta
end


use SystemAlturaCoffee
go

create proc pA_guardar_venta(
@idventa int,
@fecha date,
@serie varchar(7),
@num_documento varchar(7),
@subtotal decimal(8,2),
@iva decimal(8,2),
@total decimal(8,2),
@estado varchar (20),
@idusuario int,
@idcliente int
) as 
begin
     insert into venta(idventa, fecha, serie, num_documento, subtotal, iva, total, estado, idusuario, idcliente)
	 values (@idventa, @fecha, @serie, @num_documento, @subtotal, @iva, @total, @estado, @idusuario, @idcliente)
end

create proc pA_editar_venta(
  @idventa int,
  @fecha date,
  @serie varchar(7),
  @num_documento varchar(7),
  @subtotal decimal(8,2),
  @iva decimal(8,2),
  @total decimal(8,2),
  @estado varchar(20),
  @idusuario int,
  @idcliente int
) as 
begin

  update venta set
    fecha = isnull(@fecha, fecha),
    serie = isnull(@serie, serie),
    num_documento = isnull(@num_documento, num_documento),
    subtotal = isnull(@subtotal, subtotal),
    iva = isnull(@iva, iva),
    total = isnull(@total, total),
    estado = isnull(@estado, estado),
    idusuario = isnull(@idusuario, idusuario),
    idcliente = isnull(@idcliente, idcliente)
  where idventa = @idventa

end

create proc pA_eliminar_venta(
@idventa int
)
as 
begin
delete from venta where idventa = @idventa 
end
