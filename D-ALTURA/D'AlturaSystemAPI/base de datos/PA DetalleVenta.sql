create proc pA_lista_detalleventa
as
begin
     select 
         iddetalleventa,
         cantidad,
         precio,
         total,
         idventa,
         idproducto
     from detalleventa
end

use SystemAlturaCoffee
go

CREATE PROCEDURE pA_guardar_detalleventa(
    @cantidad INT,
    @precio DECIMAL(8, 2),
    @total DECIMAL(8, 2),
    @idventa INT,
    @idproducto INT
)
AS 
BEGIN
    INSERT INTO detalleventa(cantidad, precio, total, idventa, idproducto)
    VALUES (@cantidad, @precio, @total, @idventa, @idproducto)
END

create proc pA_editar_detalleventa(
  @iddetalleventa int,
  @cantidad int,
  @precio decimal(8,2),
  @total decimal(8,2),
  @idventa int,
  @idproducto int
) as 
begin

  update detalleventa set
    cantidad = isnull(@cantidad, cantidad),
    precio = isnull(@precio, precio),
    total = isnull(@total, total),
    idventa = isnull(@idventa, idventa),
    idproducto = isnull(@idproducto, idproducto)
  where iddetalleventa = @iddetalleventa

end

create proc pA_eliminar_detalleventa(
  @iddetalleventa int
)
as 
begin
  delete from detalleventa where iddetalleventa = @iddetalleventa
end



