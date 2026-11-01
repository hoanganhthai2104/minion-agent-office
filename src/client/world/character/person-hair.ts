import * as THREE from 'three';
import { HAIR_STYLES } from '../../../shared/avatar';
import { mesh, toon } from '../toon';

/** Hair is a set of shapes on the head (whose center is 0,0,0; the face looks down +z), in `style` (of HAIR_STYLES). */
export function styleHair(hair: THREE.Group, m: THREE.MeshToonMaterial, style: number) {
  for (const o of hair.children) (o as THREE.Mesh).geometry.dispose();
  hair.clear();
  const add = (geo: THREE.BufferGeometry, x: number, y: number, z: number, rx = 0, rz = 0) => {
    const part = mesh(geo, m, x, y, z);
    part.rotation.set(rx, 0, rz);
    hair.add(part);
    return part;
  };
  const cap = () => add(new THREE.SphereGeometry(0.355, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.45), 0, 0.02, -0.02, -0.25);
  switch (HAIR_STYLES[style]) {
    case 'Short':
      cap();
      break;
    case 'Long': {
      cap();
      // A curtain down the back, open at the front so the face shows.
      // Around the head from ear to ear the back way, leaving the face open (phi = π/2 is the face).
      const back = add(new THREE.SphereGeometry(0.37, 20, 14, Math.PI * 0.93, Math.PI * 1.14, Math.PI * 0.3, Math.PI * 0.5), 0, -0.06, -0.03);
      back.scale.set(1.02, 1.35, 1);
      break;
    }
    case 'Bun':
      cap();
      add(new THREE.SphereGeometry(0.14, 14, 12), 0, 0.3, -0.2);
      break;
    case 'Spiky':
      cap();
      // Two rows of spikes fanned out over the crown.
      for (const [row, n, z, tilt] of [
        [0, 5, 0.08, 0.35],
        [1, 4, -0.12, -0.3],
      ] as const) {
        for (let i = 0; i < n; i++) {
          const a = -0.85 + (i / (n - 1)) * 1.7;
          const spike = add(new THREE.ConeGeometry(0.1, 0.3, 8), Math.sin(a) * 0.24, 0.33 - Math.abs(a) * 0.08 - row * 0.02, z);
          spike.rotation.set(tilt, 0, -a * 0.9);
        }
      }
      break;
    case 'Curly': {
      // Little puffs spread over the top and back of the head, leaving the face clear.
      const n = 70;
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const th = i * 2.39996;
        const px = Math.cos(th) * r;
        const pz = Math.sin(th) * r;
        if (y < -0.15 || (pz > 0.35 && y < 0.55)) continue;
        add(new THREE.SphereGeometry(0.1, 8, 6), px * 0.36, y * 0.36 + 0.04, pz * 0.36 - 0.02);
      }
      break;
    }
    case 'Ponytail': {
      cap();
      add(new THREE.SphereGeometry(0.075, 10, 8), 0, 0.12, -0.34);
      const tail = add(new THREE.CapsuleGeometry(0.085, 0.3, 6, 10), 0, -0.1, -0.42, 0.35);
      tail.scale.set(1, 1, 0.8);
      break;
    }
        case 'Bald':
      break;
    case '🍌 Stuart': {
      // 1-Eye Minion (Stuart):
      // Black Strap
      const strap = mesh(new THREE.TorusGeometry(0.345, 0.035, 6, 24), toon('#1d1d1d'), 0, 0.02, 0);
      strap.rotation.x = Math.PI / 2;
      hair.add(strap);

      // Goggle Rim
      const goggleRim = mesh(new THREE.TorusGeometry(0.14, 0.028, 8, 24), toon('#9aa3ad'), 0, 0.02, 0.32);
      const clampL = mesh(new THREE.BoxGeometry(0.045, 0.038, 0.04), toon('#9aa3ad'), -0.16, 0.02, 0.30);
      const clampR = mesh(new THREE.BoxGeometry(0.045, 0.038, 0.04), toon('#9aa3ad'), 0.16, 0.02, 0.30);
      hair.add(goggleRim, clampL, clampR);

      // Eye White
      const eyeWhite = mesh(new THREE.SphereGeometry(0.12, 14, 12), toon('#ffffff'), 0, 0.02, 0.28);
      eyeWhite.scale.z = 0.55;
      hair.add(eyeWhite);

      // Pupil & Iris
      const pupil = mesh(new THREE.SphereGeometry(0.058, 10, 8), toon('#5d3416'), 0, 0.02, 0.33);
      const pupilCenter = mesh(new THREE.SphereGeometry(0.028, 8, 6), toon('#1d1d1d'), 0, 0.02, 0.35);
      const sparkle = mesh(new THREE.SphereGeometry(0.015, 6, 6), toon('#ffffff'), 0.016, 0.035, 0.36);
      pupil.add(pupilCenter, sparkle);
      hair.add(pupil);

      // Stuart parted hair
      for (const sx of [-1, 1]) {
        for (let j = 0; j < 3; j++) {
          const strand = mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.08, 4), toon('#1d1d1d'), sx * (0.04 + j * 0.04), 0.35, (j - 1) * 0.02);
          strand.rotation.z = -sx * 0.65;
          hair.add(strand);
        }
      }
      break;
    }
    case '🍌 Bob': {
      // 2-Eyes Minion (Bob):
      const strap = mesh(new THREE.TorusGeometry(0.345, 0.035, 6, 24), toon('#1d1d1d'), 0, 0.02, 0);
      strap.rotation.x = Math.PI / 2;
      hair.add(strap);

      for (const sx of [-1, 1]) {
        const eyeX = sx * 0.11;
        const goggleRim = mesh(new THREE.TorusGeometry(0.10, 0.025, 8, 20), toon('#9aa3ad'), eyeX, 0.02, 0.32);
        const clamp = mesh(new THREE.BoxGeometry(0.04, 0.035, 0.04), toon('#9aa3ad'), sx * 0.20, 0.02, 0.29);
        const eyeWhite = mesh(new THREE.SphereGeometry(0.09, 12, 10), toon('#ffffff'), eyeX, 0.02, 0.28);
        eyeWhite.scale.z = 0.55;
        hair.add(goggleRim, clamp, eyeWhite);

        // Heterochromia (1 green, 1 brown!)
        const irisColor = sx === -1 ? '#2e8b57' : '#5d3416';
        const pupil = mesh(new THREE.SphereGeometry(0.048, 10, 8), toon(irisColor), eyeX, 0.02, 0.33);
        const pupilCenter = mesh(new THREE.SphereGeometry(0.024, 8, 6), toon('#1d1d1d'), eyeX, 0.02, 0.35);
        const sparkle = mesh(new THREE.SphereGeometry(0.013, 6, 6), toon('#ffffff'), eyeX + 0.013, 0.035, 0.36);
        pupil.add(pupilCenter, sparkle);
        hair.add(pupil);
      }
      const bridge = mesh(new THREE.BoxGeometry(0.04, 0.028, 0.03), toon('#9aa3ad'), 0, 0.02, 0.33);
      hair.add(bridge);
      // Bob is bald
      break;
    }
    case '🍌 Kevin': {
      // 2-Eyes Minion with Sprout Tuft (Kevin):
      const strap = mesh(new THREE.TorusGeometry(0.345, 0.035, 6, 24), toon('#1d1d1d'), 0, 0.02, 0);
      strap.rotation.x = Math.PI / 2;
      hair.add(strap);

      for (const sx of [-1, 1]) {
        const eyeX = sx * 0.11;
        const goggleRim = mesh(new THREE.TorusGeometry(0.10, 0.025, 8, 20), toon('#9aa3ad'), eyeX, 0.02, 0.32);
        const clamp = mesh(new THREE.BoxGeometry(0.04, 0.035, 0.04), toon('#9aa3ad'), sx * 0.20, 0.02, 0.29);
        const eyeWhite = mesh(new THREE.SphereGeometry(0.09, 12, 10), toon('#ffffff'), eyeX, 0.02, 0.28);
        eyeWhite.scale.z = 0.55;
        hair.add(goggleRim, clamp, eyeWhite);

        const pupil = mesh(new THREE.SphereGeometry(0.048, 10, 8), toon('#5d3416'), eyeX, 0.02, 0.33);
        const pupilCenter = mesh(new THREE.SphereGeometry(0.024, 8, 6), toon('#1d1d1d'), eyeX, 0.02, 0.35);
        const sparkle = mesh(new THREE.SphereGeometry(0.013, 6, 6), toon('#ffffff'), eyeX + 0.013, 0.035, 0.36);
        pupil.add(pupilCenter, sparkle);
        hair.add(pupil);
      }
      const bridge = mesh(new THREE.BoxGeometry(0.04, 0.028, 0.03), toon('#9aa3ad'), 0, 0.02, 0.33);
      hair.add(bridge);

      // Sprout tuft
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2;
        const strand = mesh(new THREE.CylinderGeometry(0.006, 0.008, 0.11, 4), toon('#1d1d1d'), Math.cos(ang) * 0.025, 0.39, Math.sin(ang) * 0.025);
        strand.rotation.z = Math.cos(ang) * 0.25;
        strand.rotation.x = Math.sin(ang) * 0.25;
        hair.add(strand);
      }
      break;
    }
  }
  hair.traverse((o) => ((o as THREE.Mesh).castShadow = true));
}
