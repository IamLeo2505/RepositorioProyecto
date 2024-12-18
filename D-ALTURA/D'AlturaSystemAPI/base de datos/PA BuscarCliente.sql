USE [SystemAlturaCoffee]
GO
/****** Object:  StoredProcedure [dbo].[pA_BuscarEmpleado]    Script Date: 30/10/2024 13:40:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[pA_BuscarEmpleado]
    @idempleado INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT idempleado, nombre, apellidos
    FROM dbo.empleado
    WHERE idempleado = @idempleado;
END;


CREATE PROCEDURE pA_BuscarCliente
    @idcliente INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT idcliente, nombre, apellidos
    FROM dbo.cliente
    WHERE idcliente = @idcliente;
END;