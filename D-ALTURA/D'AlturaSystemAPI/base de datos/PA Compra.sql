CREATE PROC pA_lista_compra
AS
BEGIN
    SELECT 
        idcompra, fecha, num_documento, subtotal, iva, total, estado, idusuario, idproveedor
    FROM compra
END


use SystemAlturaCoffee
go

CREATE PROC pA_guardar_compra (
    @idcompra int,
    @fecha date,
    @num_documento varchar(7),
    @subtotal decimal(8,2),
    @iva decimal(8,2),
    @total decimal(8,2),
    @estado varchar(20),
    @idusuario int,
    @idproveedor int
) 
AS 
BEGIN
    INSERT INTO compra(idcompra, fecha, num_documento, subtotal, iva, total, estado, idusuario, idproveedor)
    VALUES (@idcompra, @fecha, @num_documento, @subtotal, @iva, @total, @estado, @idusuario, @idproveedor)
END

CREATE PROC pA_editar_compra(
  @idcompra int,
  @fecha date,
  @num_documento varchar(7),
  @subtotal decimal(8,2),
  @iva decimal(8,2),
  @total decimal(8,2),
  @estado varchar(20),
  @idusuario int,
  @idproveedor int
) 
AS 
BEGIN
  UPDATE compra SET
    fecha = ISNULL(@fecha, fecha),
    num_documento = ISNULL(@num_documento, num_documento),
    subtotal = ISNULL(@subtotal, subtotal),
    iva = ISNULL(@iva, iva),
    total = ISNULL(@total, total),
    estado = ISNULL(@estado, estado),
    idusuario = ISNULL(@idusuario, idusuario),
    idproveedor = ISNULL(@idproveedor, idproveedor)
  WHERE idcompra = @idcompra
END

CREATE PROC pA_eliminar_compra (
    @idcompra int
)
AS 
BEGIN
    DELETE FROM compra WHERE idcompra = @idcompra 
END

