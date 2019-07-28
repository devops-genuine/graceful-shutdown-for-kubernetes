# graceful-shutdown-for-kubernetes

Graceful shutdown is the one of best practice that all of develops and operators must be implement for your applications and there are many article to guide you to implement it but not every method can do it effectively. So gather the method that already proved, it worked.

Normal behaviors for graceful shutdown
After applictaion recieved SIGTERM, the graceful shutdown will be triggered, Then
1) Stop recieve new session
2) Wait until running sesion is conpleted
3) Close endpoint connection such as database, message-queue etc.
4) Applictaion recieve SIGKILL, Then exit process

There are 2 example codes for
- golang
- nodejs