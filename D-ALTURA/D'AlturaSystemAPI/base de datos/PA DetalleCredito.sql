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
ALTER PROCEDURE pA_guardar_detallecredito(
    @FechaPago DATE,
    @MontoAbono DECIMAL(10,0),
    @IdCrédito INT  -- Parametro para vincular el crédito maestro
) AS 
BEGIN
    INSERT INTO DetalleCrédito (FechaPago, MontoAbono, IdCrédito)
    VALUES (@FechaPago, @MontoAbono, @IdCrédito);
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
