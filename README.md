# TC_Grupo9

# Documentación del proyecto: https://docs.google.com/document/d/1bOVS9Rpgw-HcCYWPwxKOohF1oLniiG_u6zSjPxt9qy4/edit?tab=t.0

# DESARROLLO

Dependiendo del tipo de tarea que hagas, trabaja en la rama correspondiente (NUNCA EN MAIN):

Para tareas de frontend, usa la rama front.

Para tareas de backend, usa la rama back.

En la terminal de vscode:

-Cambiar a la rama correspondiente: git checkout front o git checkout back

-Actualizar tu rama local: git pull origin front o git pull origin back

# SUBIR CAMBIOS

-Añadí los cambios: git add . (o bien git add -nombre del archivo especifico- (para no subir todos los cambios con el mismo msj))

-Commit con mensaje claro: git commit -m "Describí brevemente lo que hiciste"

-Subí los cambios: git push origin front (o git push origin back)

# HACER PR HACIA DEVELOP

Una vez que termines tu desarrollo (o una parte importante), creá un Pull Request desde tu rama (front o back) hacia la rama develop.

En GitHub, andá a la sección de Pull Requests.

Hacé clic en "New Pull Request".

Asegurate de que sea de front o back hacia DEVELOP.

Agregá una descripción clara de lo que hiciste.

Asigná al menos un revisor del equipo.

# FUSIONAR DEVELOP CON MAIN (cuando todos hayan revisado/visto los cambios)

Cuando develop tenga cambios estables y aprobados por el grupo, se puede fusionar con main (idealmente solo por una persona designada):

-Cambiá a main: git checkout main

-Actualizá main: git pull origin main

-Fusioná develop: git merge develop

-Subí los cambios: git push origin main

# EJEMPLO DE ENDPOINT PARA USAR BUSQUEDA CON QUERY

-Para buscar metodo_pago con estado 1(activo)> BASE_URL/pago/buscar_metodo_pago?estado=1&ordenCol=nombre&ordenDir=ASC&pageIndex=1&pageSize=10
-Para buscar metodo_pago con estado 0(deshabilitado)> BASE_URL/pago/buscar_metodo_pago?estado=0&ordenCol=nombre&ordenDir=ASC&pageIndex=1&pageSize=10
Los params son para hacer una busqueda completa. Si queres buscar uno especifico tenes que filtrar desde front. Hace una busqueda de 10 elementos entonces no es una consulta pesada. Es para usar paginado, va cambiando el page index y page size
