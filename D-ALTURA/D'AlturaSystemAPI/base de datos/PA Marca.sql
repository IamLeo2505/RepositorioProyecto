use SystemAlturaCoffee
go

create proc pA_lista_marca
as
begin
     select
	 idmarca, nombremarca
	 from Marca
end

create proc pA_guardar_marca(
@nombremarca varchar(50) )
as 
begin
     insert into Marca(nombremarca)
	 values (@nombremarca)
end



create proc pA_editar_marca(
@idmarca int, 
@nombremarca varchar(50)
) as 
begin

update Marca set

nombremarca = isnull (@nombremarca, nombremarca)
where idmarca = @idmarca

end


create proc pA_eliminar_marca(
@idmarca int
)
as 
begin
delete from marca where idmarca = @idmarca
end