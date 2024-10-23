create proc pA_lista_usuario
as
begin
     select 
	 idusuario, usuario, pass, acceso, estado, idempleado
	 from usuario
end

create proc pA_guardar_usuario(
@usuario varchar (20),
@pass varchar (20),
@acceso varchar (20),
@estado varchar (10),
@idempleado int
) as 
begin
     insert into usuario(usuario, pass, acceso, estado, idempleado)
	 values (@usuario, @pass, @acceso, @estado, @idempleado)
end

create proc pA_editar_usuario(
@idusuario int,
@usuario varchar (20) NULL,
@pass varchar (20) NULL,
@acceso varchar (20) NULL,
@estado varchar (10) NULL,
@idempleado int NULL
) as 
begin

update usuario set
usuario = isnull(@usuario, usuario),
pass = isnull(@pass, pass),
acceso = isnull(@acceso, acceso),
estado = isnull(@estado, estado),
idempleado = isnull(@idempleado, idempleado)
where idusuario = @idusuario
end

create proc pA_eliminar_usuario(
@idusuario int
)
as 
begin
delete from usuario where idusuario = @idusuario
end

select * from usuario;
