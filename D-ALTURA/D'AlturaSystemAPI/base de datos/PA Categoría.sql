create proc pA_lista_categoria
as
begin
     select 
	 idcategoria, descripcion
	 from categoria
end


use SystemAlturaCoffee
go

create proc pA_guardar_categoria(
@descripcion varchar(50)
) as 
begin
     insert into categoria(descripcion)
	 values (@descripcion)
end



create proc pA_editar_categoria(
@idcategoria int,
@descripcion varchar(50) null
) as 
begin

update categoria set

descripcion = isnull(@descripcion, descripcion)
where idcategoria = @idcategoria

end


create proc pA_eliminar_categoria(
@idcategoria int
)
as 
begin
delete from categoria where idcategoria = @idcategoria
end