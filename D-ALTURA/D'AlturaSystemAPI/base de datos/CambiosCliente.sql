use SystemAlturaCoffee

select * from Crédito

ALTER TABLE cliente ADD activo BIT DEFAULT 1;

-- En lugar de eliminar el cliente, simplemente lo marcas como inactivo

UPDATE cliente
SET activo = 1
WHERE activo IS NULL;

ALTER TABLE cliente
ALTER COLUMN activo BIT NOT NULL;


SELECT * FROM cliente 


SELECT nombre, apellidos, dni, ruc, telefono, 
    CASE 
        WHEN activo = 1 THEN 'Activo'
        WHEN activo = 0 THEN 'Inactivo'
    END AS estado
FROM cliente;

