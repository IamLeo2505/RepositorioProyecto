create proc pA_lista_credito
as
begin
     select 
	 IdCrédito, PlazoPago, TasaInteres, Monto, FechaInicio
	 from Crédito
end


ALTER PROC pA_guardar_credito (
    @PlazoPago INT,
    @TasaInteres INT,
    @Monto DECIMAL(10, 0),
    @FechaInicio DATE
)
AS
BEGIN
    INSERT INTO Crédito (PlazoPago, TasaInteres, Monto, FechaInicio)
    VALUES (@PlazoPago, @TasaInteres, @Monto, @FechaInicio)
END


create proc pA_editar_credito(
@IdCrédito int,
@PlazoPago int null,
@TasaInteres int null,
@Monto decimal(10, 0) null
) as 
begin

update Crédito set

PlazoPago = isnull(@PlazoPago, PlazoPago),
TasaInteres = isnull(@TasaInteres, TasaInteres),
Monto = isnull(@Monto, Monto)
where IdCrédito = @IdCrédito
end

create proc pA_eliminar_credito(
@IdCrédito int
)
as 
begin
delete from Crédito where IdCrédito = @IdCrédito
end