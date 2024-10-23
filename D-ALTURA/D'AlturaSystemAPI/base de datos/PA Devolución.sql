create proc pA_lista_devolucion
as
begin
     select 
	 IdDevolución, FechaDevolución, Motivo
	 from Devolución
end



create proc pA_guardar_devolucion(
@FechaDevolución date,
@Motivo varchar(20)
) as 
begin
     insert into Devolución(FechaDevolución, Motivo)
	 values (@FechaDevolución, @Motivo)
end



create proc pA_editar_devolucion(
@IdDevolución int null,
@FechaDevolución date null,
@Motivo varchar(20) null
) as 
begin

update Devolución set
FechaDevolución = isnull(@FechaDevolución, FechaDevolución),
Motivo = isnull(@Motivo, Motivo)
where IdDevolución = @IdDevolución

end


create proc pA_eliminar_devolucion(
@IdDevolucion int
)
as 
begin
delete from Devolución where IdDevolución = @IdDevolucion
end

select * from Devolución;
