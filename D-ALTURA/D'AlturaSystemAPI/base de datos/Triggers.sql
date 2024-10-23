CREATE TABLE log_inserciones (
    idlog INT PRIMARY KEY IDENTITY(1,1),
    idcliente INT,
    fecha_insercion DATETIME
);

CREATE TRIGGER trg_insercion_cliente
ON cliente
AFTER INSERT
AS
BEGIN
    -- Inserta un nuevo registro en log_inserciones cada vez que se inserte un nuevo cliente
    INSERT INTO log_inserciones (idcliente, fecha_insercion)
    SELECT i.idcliente, GETDATE()
    FROM inserted i;
END;

CREATE TRIGGER trg_actualizar_stock
ON detalleventa
AFTER INSERT
AS
BEGIN
    -- Actualizamos el stock del producto restando la cantidad vendida
    UPDATE producto
    SET stock = stock - i.cantidad
    FROM producto p
    INNER JOIN inserted i ON p.idproducto = i.idproducto
    WHERE p.idproducto = i.idproducto;
END;

CREATE TRIGGER trg_prevent_negative_stock
ON detalleventa
AFTER INSERT
AS
BEGIN
    -- Verificamos si la cantidad vendida supera el stock disponible
    IF EXISTS (
        SELECT *
        FROM inserted i
        INNER JOIN producto p ON i.idproducto = p.idproducto
        WHERE p.stock < i.cantidad
    )
    BEGIN
        -- Si no hay suficiente stock, revertimos la transacción
        RAISERROR('No hay suficiente stock para realizar la venta', 16, 1);
        ROLLBACK TRANSACTION;
    END;
END;


CREATE TRIGGER trg_registrar_credito
ON venta
AFTER INSERT
AS
BEGIN
    -- Inserta un registro en la tabla de crédito si el tipo de pago es crédito
    INSERT INTO Crédito ( Monto, TasaInteres, FechaInicio, PlazoPago)
    SELECT v.idcliente, v.idventa, v.total, GETDATE()
    FROM inserted v
    WHERE v.tipo_pago = 'credito';
END;	

CREATE TRIGGER trg_actualizar_inventario_compra
ON detallecompra
AFTER INSERT
AS
BEGIN
    -- Actualiza la cantidad en inventario del producto comprado
    UPDATE producto
    SET stock = stock + dc.cantidad
    FROM producto p
    INNER JOIN inserted dc ON p.idproducto = dc.idproducto;
END;


CREATE TRIGGER trg_insercion_usuario
ON usuario
AFTER INSERT
AS
BEGIN
    -- Registra la inserción del usuario en la tabla de log
    INSERT INTO log_inserciones (idusuario, fecha_insercion)
    SELECT i.idusuario, GETDATE()
    FROM inserted i;
END;

CREATE TABLE log_auditoria (
    idlog INT PRIMARY KEY IDENTITY(1,1),
    tabla NVARCHAR(50),
    accion NVARCHAR(10),
    registro_id INT,
    fecha DATETIME,
    usuario NVARCHAR(50)
);

-- Auditoría para INSERT en productos
CREATE TRIGGER trg_auditoria_insert_producto
ON producto
AFTER INSERT
AS
BEGIN
    INSERT INTO log_auditoria (tabla, accion, registro_id, fecha, usuario)
    SELECT 'producto', 'INSERT', i.idproducto, GETDATE(), SYSTEM_USER
    FROM inserted i;
END;

-- Auditoría para UPDATE en productos
CREATE TRIGGER trg_auditoria_update_producto
ON producto
AFTER UPDATE
AS
BEGIN
    INSERT INTO log_auditoria (tabla, accion, registro_id, fecha, usuario)
    SELECT 'producto', 'UPDATE', i.idproducto, GETDATE(), SYSTEM_USER
    FROM inserted i;
END;

-- Auditoría para DELETE en productos
CREATE TRIGGER trg_auditoria_delete_producto
ON producto
AFTER DELETE
AS
BEGIN
    INSERT INTO log_auditoria (tabla, accion, registro_id, fecha, usuario)
    SELECT 'producto', 'DELETE', d.idproducto, GETDATE(), SYSTEM_USER
    FROM deleted d;
END;



-- Auditoría para INSERT
CREATE TRIGGER trg_auditoria_insert_empleado
ON empleado
AFTER INSERT
AS
BEGIN
    INSERT INTO log_auditoria (tabla, accion, registro_id, fecha, usuario)
    SELECT 'empleado', 'INSERT', i.idempleado, GETDATE(), SYSTEM_USER
    FROM inserted i;
END;

-- Auditoría para UPDATE
CREATE TRIGGER trg_auditoria_update_empleado
ON empleado
AFTER UPDATE
AS
BEGIN
    INSERT INTO log_auditoria (tabla, accion, registro_id, fecha, usuario)
    SELECT 'empleado', 'UPDATE', i.idempleado, GETDATE(), SYSTEM_USER
    FROM inserted i;
END;

-- Auditoría para DELETE
CREATE TRIGGER trg_auditoria_delete_empleado
ON empleado
AFTER DELETE
AS
BEGIN
    INSERT INTO log_auditoria (tabla, accion, registro_id, fecha, usuario)
    SELECT 'empleado', 'DELETE', d.idempleado, GETDATE(), SYSTEM_USER
    FROM deleted d;
END;



-- Auditoría para INSERT en ventas
CREATE TRIGGER trg_auditoria_insert_venta
ON venta
AFTER INSERT
AS
BEGIN
    INSERT INTO log_auditoria (tabla, accion, registro_id, fecha, usuario)
    SELECT 'venta', 'INSERT', i.idventa, GETDATE(), SYSTEM_USER
    FROM inserted i;
END;

-- Auditoría para UPDATE en ventas
CREATE TRIGGER trg_auditoria_update_venta
ON venta
AFTER UPDATE
AS
BEGIN
    INSERT INTO log_auditoria (tabla, accion, registro_id, fecha, usuario)
    SELECT 'venta', 'UPDATE', i.idventa, GETDATE(), SYSTEM_USER
    FROM inserted i;
END;

-- Auditoría para DELETE en ventas
CREATE TRIGGER trg_auditoria_delete_venta
ON venta
AFTER DELETE
AS
BEGIN
    INSERT INTO log_auditoria (tabla, accion, registro_id, fecha, usuario)
    SELECT 'venta', 'DELETE', d.idventa, GETDATE(), SYSTEM_USER
    FROM deleted d;
END;


CREATE TRIGGER trg_validacion_cantidad_producto
ON producto
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (SELECT * FROM inserted WHERE stock < 0)
    BEGIN
        RAISERROR('No se puede insertar o actualizar un producto con cantidad negativa', 16, 1);
        ROLLBACK TRANSACTION;
    END;
END;

/*CREATE TRIGGER trg_validacion_cedula_empleado
ON empleado
after INSERT
AS
BEGIN
    IF EXISTS (SELECT * FROM empleado e
               INNER JOIN inserted i ON e.dni = i.dni)
    BEGIN
        RAISERROR('La cédula ya está registrada para otro empleado', 16, 1);
        ROLLBACK TRANSACTION;
    END;
END;
*/

CREATE TRIGGER trg_validacion_stock_venta
ON detalleventa
after INSERT
AS
BEGIN
    IF EXISTS (SELECT * 
               FROM inserted i
               INNER JOIN producto p ON i.idproducto = p.idproducto
               WHERE i.cantidad > p.stock)
    BEGIN
        RAISERROR('No hay suficiente stock para el producto', 16, 1);
        ROLLBACK TRANSACTION;
    END;
END;
