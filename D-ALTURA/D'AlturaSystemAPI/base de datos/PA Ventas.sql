USE SystemAlturaCoffee
GO

-- Procedimiento para listar ventas
CREATE PROCEDURE pA_lista_venta
AS
BEGIN
    SELECT 
        idventa, fecha, serie, num_documento, subtotal, iva, total, estado, idusuario, idcliente
    FROM venta;
END;
GO

-- Procedimiento para guardar una venta (insertar)
CREATE PROCEDURE pA_guardar_venta
    @idventa INT OUTPUT,  
    @fecha DATE,
    @serie NVARCHAR(50),
    @num_documento NVARCHAR(50),
    @subtotal DECIMAL(18, 2),
    @iva DECIMAL(18, 2),
    @total DECIMAL(18, 2),
    @estado NVARCHAR(50),
    @idusuario INT,
    @idcliente INT
AS
BEGIN
    INSERT INTO venta (fecha, serie, num_documento, subtotal, iva, total, estado, idusuario, idcliente)
    VALUES (@fecha, @serie, @num_documento, @subtotal, @iva, @total, @estado, @idusuario, @idcliente);

    -- Captura el ID de la venta recién insertada
    SET @idventa = SCOPE_IDENTITY();
END;
GO

-- Procedimiento para editar una venta (actualizar)
CREATE PROCEDURE pA_editar_venta
    @idventa INT,
    @fecha DATE = NULL,
    @serie NVARCHAR(50) = NULL,
    @num_documento NVARCHAR(50) = NULL,
    @subtotal DECIMAL(18, 2) = NULL,
    @iva DECIMAL(18, 2) = NULL,
    @total DECIMAL(18, 2) = NULL,
    @estado NVARCHAR(50) = NULL,
    @idusuario INT = NULL,
    @idcliente INT = NULL
AS
BEGIN
    UPDATE venta
    SET
        fecha = ISNULL(@fecha, fecha),
        serie = ISNULL(@serie, serie),
        num_documento = ISNULL(@num_documento, num_documento),
        subtotal = ISNULL(@subtotal, subtotal),
        iva = ISNULL(@iva, iva),
        total = ISNULL(@total, total),
        estado = ISNULL(@estado, estado),
        idusuario = ISNULL(@idusuario, idusuario),
        idcliente = ISNULL(@idcliente, idcliente)
    WHERE idventa = @idventa;
END;
GO

-- Procedimiento para eliminar una venta (borrar)
CREATE PROCEDURE pA_eliminar_venta
    @idventa INT
AS
BEGIN
    DELETE FROM venta WHERE idventa = @idventa;
END;
GO
