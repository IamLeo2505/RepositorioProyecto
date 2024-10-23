CREATE PROCEDURE pA_lista_detallecredito
AS
BEGIN
    SELECT 
        IdDetalleCrédito,
        FechaPago,
        MontoAbono
    FROM DetalleCrédito
END

USE SystemAlturaCoffee
GO

CREATE PROCEDURE pA_guardar_detallecredito(
    @FechaPago Date,
    @MontoAbono DECIMAL(10,0)
) AS 
BEGIN
    INSERT INTO DetalleCrédito(FechaPago, MontoAbono)
    VALUES (@FechaPago, @MontoAbono)
END

CREATE PROCEDURE pA_editar_detallecredito(
  @IdDetalleCrédito INT null,
  @FechaPago Date null,
  @MontoAbono DECIMAL(10,0) null
) AS 
BEGIN
  UPDATE DetalleCrédito SET
    FechaPago = @FechaPago,
	MontoAbono = @MontoAbono
  WHERE IdDetalleCrédito = @IdDetalleCrédito
END

CREATE PROCEDURE pA_eliminar_detallecredito(
  @IdDetalleCrédito INT
)
AS 
BEGIN
  DELETE FROM DetalleCrédito WHERE IdDetalleCrédito = @IdDetalleCrédito
END
