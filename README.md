# TC_Grupo9

# DESARROLLO
Dependiendo del tipo de tarea que hagas, trabaja en la rama correspondiente (NUNCA EN MAIN):

Para tareas de frontend, usa la rama front.

Para tareas de backend, usa la rama back.

En la terminal de vscode: 

-Cambiar a la rama correspondiente: git checkout front  o git checkout back

-Actualizar tu rama local: git pull origin front  o git pull origin back

# SUBIR CAMBIOS
-Añadí los cambios: git add . (o bien git add -nombre del archivo especifico- (para no subir todos los cambios con el mismo msj))

-Commit con mensaje claro: git commit -m "Describí brevemente lo que hiciste"

-Subí los cambios: git push origin front      (o git push origin back)

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


