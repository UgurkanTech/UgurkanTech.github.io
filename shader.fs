fs=`


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 toneMapHDR(vec3 color, float exposure) {
    float gamma = 1.5; // Gamma correction value

    // Apply exposure adjustment
    vec3 mappedColor = color * exposure;

    // Apply gamma correction
    mappedColor = pow(mappedColor, vec3(1.0 / gamma));

    return mappedColor;
}

void main(void)
{

    vec2 uv = gl_FragCoord.xy / resolution.xy - .5;
    uv.y *= resolution.y / resolution.x;
    vec3 dir = vec3(uv * 1.4, 1.);
    float a2 = time * 0.001 + .5;
    float a1 = a2;
    mat2 rot1 = mat2(cos(a1), sin(a1), - sin(a1), cos(a1));
    mat2 rot2 = rot1;
    dir.xz *= rot1;
    dir.xy *= rot2;
    vec3 from = vec3(0., 0., 0.);
    
    from += vec3(1.25 * sin(mouse.x * 0.5),  -1.03 * mouse.y * 0.7, - 2.);
    from.xz *= rot1;
    from.xy *= rot2;
    float s = .1, fade = .07;
    vec3 v = vec3(0.4);
    for(
        int r = 0;
        r < 10;
        r ++
    )
        {
            vec3 p = from + s * dir * 1.5;
            p = abs(vec3(0.750) - mod(p, vec3(0.750 * 2.)));
            p.x += float(r * r) * 0.01;
            p.y += float(r) * 0.02;
            float pa, a = pa = 0.;
            for(
                int i = 0;
                i < 15;
                i ++
            )
                {
                    p = abs(p) / dot(p, p) - 0.340;
                    a += abs(length(p) - pa * 0.2);

                    pa = length(p);
                }
            a *= a * a * 2.;
            v += vec3(s, s * s, s * s * s * s) * a * 0.0017 * fade;
            fade *= 0.960;
            s += 0.110;
        }
    v = mix(vec3(length(v)), v, 0.8);

    v = v * .01;

    float exposure = 0.1; // Adjust the exposure value as needed

    vec3 tonedColor = toneMapHDR(v, exposure);

    gl_FragColor = vec4(tonedColor, 1.);
}


`