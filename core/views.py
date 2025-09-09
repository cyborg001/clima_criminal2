from django.shortcuts import render

def mapa(request):
    return render(request, 'casos.html')

def reportar(request):
    return render(request, 'reportar.html')

def estadisticas(request):
    return render(request, 'estadisticas.html')
