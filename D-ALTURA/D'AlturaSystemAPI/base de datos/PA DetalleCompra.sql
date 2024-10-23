CREATE PROCEDURE pA_lista_detallecompra
AS
BEGIN
    SELECT 
        iddetallecompra,
        cantidad,
        precio,
        total,
        idcompra,
        idproducto
    FROM detallecompra
END

USE SystemAlturaCoffee
GO

CREATE PROCEDURE pA_guardar_detallecompra(
    @iddetallecompra INT,
    @cantidad INT,
    @precio DECIMAL(8,2),
    @total DECIMAL(8,2),
    @idcompra INT,
    @idproducto INT
) AS 
BEGIN
    INSERT INTO detallecompra(iddetallecompra, cantidad, precio, total, idcompra, idproducto)
    VALUES (@iddetallecompra, @cantidad, @precio, @total, @idcompra, @idproducto)
END

CREATE PROCEDURE pA_editar_detallecompra(
  @iddetallecompra INT,
  @cantidad INT,
  @precio DECIMAL(8,2),
  @total DECIMAL(8,2),
  @idcompra INT,
  @idproducto INT
) AS 
BEGIN
  UPDATE detallecompra SET
    cantidad = ISNULL(@cantidad, cantidad),
    precio = ISNULL(@precio, precio),
    total = ISNULL(@total, total),
    idcompra = ISNULL(@idcompra, idcompra),
    idproducto = ISNULL(@idproducto, idproducto)
  WHERE iddetallecompra = @iddetallecompra
END

CREATE PROCEDURE pA_eliminar_detallecompra(
  @iddetallecompra INT
)
AS 
BEGIN
  DELETE FROM detallecompra WHERE iddetallecompra = @iddetallecompra
END
